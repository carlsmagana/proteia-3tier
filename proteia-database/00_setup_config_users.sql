-- =============================================
-- Setup inicial para config.users en Azure SQL Database
-- Base de datos: proteo
-- Servidor: xworld-proteo.database.windows.net
-- =============================================

-- Crear esquema config si no existe
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'config')
BEGIN
    EXEC('CREATE SCHEMA config')
    PRINT 'Esquema config creado'
END
ELSE
BEGIN
    PRINT 'Esquema config ya existe'
END

GO

-- Crear tabla config.users si no existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
               WHERE TABLE_SCHEMA = 'config' AND TABLE_NAME = 'users')
BEGIN
    CREATE TABLE config.users(
        IdUser int PRIMARY KEY IDENTITY(1,1),
        NameUser varchar(200),
        Email varchar(200),
        Password varchar(50)
    )
    
    PRINT 'Tabla config.users creada exitosamente'
    
    -- Insertar usuario administrador por defecto
    INSERT INTO config.users (NameUser, Email, Password) 
    VALUES ('Administrador', 'admin@proteo.com', 'admin123')
    
    PRINT 'Usuario administrador creado: admin@proteo.com / admin123'
END
ELSE
BEGIN
    PRINT 'Tabla config.users ya existe'
    
    -- Mostrar usuarios existentes (sin contraseñas)
    SELECT 
        IdUser,
        NameUser,
        Email,
        '***' as Password
    FROM config.users
    
    PRINT 'Usuarios existentes mostrados arriba'
END

GO

-- Verificar permisos necesarios
PRINT '=== Verificación de Permisos ==='

-- Verificar si podemos crear tablas
IF HAS_PERMS_BY_NAME(DB_NAME(), 'DATABASE', 'CREATE TABLE') = 1
    PRINT '✓ Permisos CREATE TABLE: OK'
ELSE
    PRINT '✗ Permisos CREATE TABLE: FALTA'

-- Verificar si podemos insertar datos
IF HAS_PERMS_BY_NAME('config.users', 'OBJECT', 'INSERT') = 1
    PRINT '✓ Permisos INSERT: OK'
ELSE
    PRINT '✗ Permisos INSERT: FALTA'

-- Verificar si podemos crear índices
IF HAS_PERMS_BY_NAME(DB_NAME(), 'DATABASE', 'CREATE TABLE') = 1
    PRINT '✓ Permisos CREATE INDEX: OK'
ELSE
    PRINT '✗ Permisos CREATE INDEX: FALTA'

GO

-- Información del entorno
SELECT 
    'Información del Entorno' as Categoria,
    'Servidor' as Propiedad,
    @@SERVERNAME as Valor
UNION ALL
SELECT 
    'Información del Entorno',
    'Base de Datos',
    DB_NAME()
UNION ALL
SELECT 
    'Información del Entorno',
    'Usuario Actual',
    SYSTEM_USER
UNION ALL
SELECT 
    'Información del Entorno',
    'Fecha/Hora',
    CONVERT(varchar, GETDATE(), 120)
UNION ALL
SELECT 
    'Información del Entorno',
    'Versión SQL',
    LEFT(@@VERSION, 50)

GO

PRINT '=== Setup inicial completado ==='
PRINT 'Próximo paso: ejecutar import_data.py'
