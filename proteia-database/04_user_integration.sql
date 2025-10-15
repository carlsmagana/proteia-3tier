-- =============================================
-- Integración con tabla config.users existente
-- =============================================

-- Verificar que existe la tabla config.users
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
               WHERE TABLE_SCHEMA = 'config' AND TABLE_NAME = 'users')
BEGIN
    PRINT 'ERROR: La tabla config.users no existe. Por favor créala primero.'
    RETURN
END

-- =============================================
-- 1. CREAR TABLA DE SESIONES DE USUARIO
-- =============================================
CREATE TABLE UserSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SessionToken NVARCHAR(500) NOT NULL UNIQUE,
    RefreshToken NVARCHAR(500) NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastActivity DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    UserAgent NVARCHAR(500) NULL,
    IpAddress NVARCHAR(50) NULL,
    
    FOREIGN KEY (UserId) REFERENCES config.users(IdUser) ON DELETE CASCADE
);

-- =============================================
-- 2. CREAR TABLA DE ROLES Y PERMISOS
-- =============================================
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE UserRoles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    AssignedAt DATETIME2 DEFAULT GETDATE(),
    AssignedBy INT NULL,
    
    FOREIGN KEY (UserId) REFERENCES config.users(IdUser) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (AssignedBy) REFERENCES config.users(IdUser),
    
    UNIQUE(UserId, RoleId)
);

-- =============================================
-- 3. INSERTAR ROLES INICIALES
-- =============================================
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'Administrador del sistema con acceso completo'),
('Analyst', 'Analista con acceso a dashboards y reportes'),
('Viewer', 'Usuario con acceso de solo lectura'),
('Manager', 'Gerente con acceso a análisis avanzados');

-- =============================================
-- 4. CREAR USUARIO PROTEIA POR DEFECTO
-- =============================================
-- Verificar si ya existe el usuario proteia
IF NOT EXISTS (SELECT 1 FROM config.users WHERE Email = 'proteia@proteo.com')
BEGIN
    INSERT INTO config.users (NameUser, Email, Password) 
    VALUES ('Proteia Admin', 'proteia@proteo.com', 'ProteoAI'); -- En producción usar hash
    
    DECLARE @ProteiaUserId INT = SCOPE_IDENTITY();
    
    -- Asignar rol de Admin
    INSERT INTO UserRoles (UserId, RoleId)
    SELECT @ProteiaUserId, Id FROM Roles WHERE RoleName = 'Admin';
    
    PRINT 'Usuario Proteia creado exitosamente';
END
ELSE
BEGIN
    PRINT 'Usuario Proteia ya existe';
END

-- =============================================
-- 5. VISTAS PARA MANEJO DE USUARIOS
-- =============================================

-- Vista completa de usuarios con roles
CREATE VIEW vw_UsersWithRoles AS
SELECT 
    u.IdUser,
    u.NameUser,
    u.Email,
    STRING_AGG(r.RoleName, ', ') as Roles,
    COUNT(ur.RoleId) as RoleCount,
    MAX(us.LastActivity) as LastActivity,
    CASE WHEN MAX(us.ExpiresAt) > GETDATE() THEN 1 ELSE 0 END as HasActiveSession
FROM config.users u
LEFT JOIN UserRoles ur ON u.IdUser = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.Id
LEFT JOIN UserSessions us ON u.IdUser = us.UserId AND us.IsActive = 1
GROUP BY u.IdUser, u.NameUser, u.Email;

GO

-- Vista de sesiones activas
CREATE VIEW vw_ActiveSessions AS
SELECT 
    us.Id as SessionId,
    u.IdUser,
    u.NameUser,
    u.Email,
    us.SessionToken,
    us.ExpiresAt,
    us.LastActivity,
    us.UserAgent,
    us.IpAddress,
    DATEDIFF(MINUTE, us.LastActivity, GETDATE()) as MinutesInactive
FROM UserSessions us
INNER JOIN config.users u ON us.UserId = u.IdUser
WHERE us.IsActive = 1 AND us.ExpiresAt > GETDATE();

GO

-- =============================================
-- 6. PROCEDIMIENTOS ALMACENADOS PARA AUTENTICACIÓN
-- =============================================

-- Procedimiento para validar login
CREATE PROCEDURE sp_ValidateUser
    @Email NVARCHAR(200),
    @Password NVARCHAR(50)
AS
BEGIN
    SELECT 
        u.IdUser,
        u.NameUser,
        u.Email,
        STRING_AGG(r.RoleName, ',') as Roles
    FROM config.users u
    LEFT JOIN UserRoles ur ON u.IdUser = ur.UserId
    LEFT JOIN Roles r ON ur.RoleId = r.Id
    WHERE u.Email = @Email AND u.Password = @Password
    GROUP BY u.IdUser, u.NameUser, u.Email;
END;

GO

-- Procedimiento para crear sesión
CREATE PROCEDURE sp_CreateUserSession
    @UserId INT,
    @SessionToken NVARCHAR(500),
    @RefreshToken NVARCHAR(500) = NULL,
    @ExpiresAt DATETIME2,
    @UserAgent NVARCHAR(500) = NULL,
    @IpAddress NVARCHAR(50) = NULL
AS
BEGIN
    -- Desactivar sesiones anteriores del usuario
    UPDATE UserSessions 
    SET IsActive = 0 
    WHERE UserId = @UserId AND IsActive = 1;
    
    -- Crear nueva sesión
    INSERT INTO UserSessions (UserId, SessionToken, RefreshToken, ExpiresAt, UserAgent, IpAddress)
    VALUES (@UserId, @SessionToken, @RefreshToken, @ExpiresAt, @UserAgent, @IpAddress);
    
    SELECT SCOPE_IDENTITY() as SessionId;
END;

GO

-- Procedimiento para validar sesión
CREATE PROCEDURE sp_ValidateSession
    @SessionToken NVARCHAR(500)
AS
BEGIN
    SELECT 
        us.Id as SessionId,
        us.UserId,
        u.NameUser,
        u.Email,
        us.ExpiresAt,
        STRING_AGG(r.RoleName, ',') as Roles
    FROM UserSessions us
    INNER JOIN config.users u ON us.UserId = u.IdUser
    LEFT JOIN UserRoles ur ON u.IdUser = ur.UserId
    LEFT JOIN Roles r ON ur.RoleId = r.Id
    WHERE us.SessionToken = @SessionToken 
        AND us.IsActive = 1 
        AND us.ExpiresAt > GETDATE()
    GROUP BY us.Id, us.UserId, u.NameUser, u.Email, us.ExpiresAt;
    
    -- Actualizar última actividad
    UPDATE UserSessions 
    SET LastActivity = GETDATE() 
    WHERE SessionToken = @SessionToken AND IsActive = 1;
END;

GO

-- Procedimiento para cerrar sesión
CREATE PROCEDURE sp_LogoutUser
    @SessionToken NVARCHAR(500)
AS
BEGIN
    UPDATE UserSessions 
    SET IsActive = 0 
    WHERE SessionToken = @SessionToken;
    
    SELECT @@ROWCOUNT as SessionsClosed;
END;

GO

-- =============================================
-- 7. ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
CREATE INDEX IX_UserSessions_SessionToken ON UserSessions(SessionToken);
CREATE INDEX IX_UserSessions_ExpiresAt ON UserSessions(ExpiresAt);
CREATE INDEX IX_UserRoles_UserId ON UserRoles(UserId);
CREATE INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);

-- =============================================
-- 8. TRIGGER PARA AUDITORÍA DE USUARIOS
-- =============================================
CREATE TRIGGER tr_Users_Audit
ON config.users
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Para INSERT
    IF EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted)
    BEGIN
        INSERT INTO AuditLogs (UserId, TableName, RecordId, Action, NewValues)
        SELECT 
            i.IdUser,
            'config.users',
            i.IdUser,
            'INSERT',
            (SELECT i.* FOR JSON AUTO)
        FROM inserted i;
    END
    
    -- Para UPDATE
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        INSERT INTO AuditLogs (UserId, TableName, RecordId, Action, OldValues, NewValues)
        SELECT 
            i.IdUser,
            'config.users',
            i.IdUser,
            'UPDATE',
            (SELECT d.* FOR JSON AUTO),
            (SELECT i.* FOR JSON AUTO)
        FROM inserted i
        INNER JOIN deleted d ON i.IdUser = d.IdUser;
    END
    
    -- Para DELETE
    IF NOT EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        INSERT INTO AuditLogs (UserId, TableName, RecordId, Action, OldValues)
        SELECT 
            NULL, -- Usuario eliminado
            'config.users',
            d.IdUser,
            'DELETE',
            (SELECT d.* FOR JSON AUTO)
        FROM deleted d;
    END
END;

GO

-- =============================================
-- 9. FUNCIÓN PARA VERIFICAR PERMISOS
-- =============================================
CREATE FUNCTION fn_UserHasRole(@UserId INT, @RoleName NVARCHAR(50))
RETURNS BIT
AS
BEGIN
    DECLARE @HasRole BIT = 0;
    
    IF EXISTS (
        SELECT 1 
        FROM UserRoles ur
        INNER JOIN Roles r ON ur.RoleId = r.Id
        WHERE ur.UserId = @UserId AND r.RoleName = @RoleName
    )
        SET @HasRole = 1;
    
    RETURN @HasRole;
END;

GO

-- =============================================
-- 10. ESTADÍSTICAS DE INTEGRACIÓN
-- =============================================
PRINT '=== Integración con config.users completada ===';

SELECT 
    'Usuarios totales' as Metric,
    COUNT(*) as Value
FROM config.users

UNION ALL

SELECT 
    'Roles creados' as Metric,
    COUNT(*) as Value
FROM Roles

UNION ALL

SELECT 
    'Usuario Proteia' as Metric,
    CASE WHEN EXISTS(SELECT 1 FROM config.users WHERE Email = 'proteia@proteo.com') 
         THEN 1 ELSE 0 END as Value;

GO
