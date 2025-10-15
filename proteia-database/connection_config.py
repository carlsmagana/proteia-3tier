#!/usr/bin/env python3
"""
Configuración de conexión específica para la base de datos Proteo
Azure SQL Database: xworld-proteo.database.windows.net
"""

# Configuración de la base de datos
DATABASE_CONFIG = {
    'server': 'xworld-proteo.database.windows.net',
    'database': 'proteo',
    'driver': 'ODBC Driver 18 for SQL Server',
    'authentication': 'sql_server',  # SQL Server Authentication
    'port': 1433,
    'encrypt': True,  # Requerido para Azure SQL
    'trust_server_certificate': False,
    'connection_timeout': 30,
    'command_timeout': 300
}

def get_connection_string(username, password):
    """
    Generar cadena de conexión para Azure SQL Database - SQLAlchemy
    """
    import urllib.parse
    
    params = urllib.parse.quote_plus(
        f"DRIVER={{{DATABASE_CONFIG['driver']}}};"
        f"SERVER={DATABASE_CONFIG['server']},{DATABASE_CONFIG['port']};"
        f"DATABASE={DATABASE_CONFIG['database']};"
        f"UID={username};"
        f"PWD={password};"
        f"Encrypt=yes;"
        f"TrustServerCertificate=no;"
        f"Connection Timeout={DATABASE_CONFIG['connection_timeout']};"
    )
    
    return f"mssql+pyodbc:///?odbc_connect={params}"

def get_direct_connection_string(username, password):
    """
    Cadena de conexión directa para pyodbc - ODBC Driver 18
    """
    return (
        f"DRIVER={{{DATABASE_CONFIG['driver']}}};"
        f"SERVER={DATABASE_CONFIG['server']},{DATABASE_CONFIG['port']};"
        f"DATABASE={DATABASE_CONFIG['database']};"
        f"UID={username};"
        f"PWD={password};"
        f"Encrypt=yes;"
        f"TrustServerCertificate=no;"
        f"Connection Timeout={DATABASE_CONFIG['connection_timeout']};"
    )

# Configuración específica para Azure SQL
AZURE_SQL_NOTES = """
NOTAS IMPORTANTES para Azure SQL Database:

1. FIREWALL: Asegúrate de que tu IP esté en la whitelist del firewall de Azure SQL
2. SSL/TLS: La conexión siempre usa encriptación (Encrypt=True)
3. TIMEOUT: Configurado para 30s de conexión, 5min de comando
4. DRIVER: Requiere ODBC Driver 17 for SQL Server o superior
5. PUERTO: Azure SQL usa el puerto estándar 1433

Para configurar el firewall desde Azure Portal:
- Ve a tu SQL Server en Azure Portal
- Configuración > Firewalls y redes virtuales
- Agregar tu IP actual o rango de IPs
"""

print(AZURE_SQL_NOTES)
