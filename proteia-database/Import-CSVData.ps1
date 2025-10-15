# =============================================
# PowerShell Script para importar datos CSV a SQL Server
# =============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerName,
    
    [Parameter(Mandatory=$true)]
    [string]$DatabaseName,
    
    [string]$Username = "",
    [string]$Password = "",
    [string]$ProjectPath = "/Users/carlosmagana/CascadeProjects/proteia"
)

# Función para ejecutar SQL
function Execute-SQL {
    param(
        [string]$Query,
        [string]$ConnectionString
    )
    
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
        $connection.Open()
        
        $command = New-Object System.Data.SqlClient.SqlCommand($Query, $connection)
        $command.CommandTimeout = 300 # 5 minutos
        $result = $command.ExecuteNonQuery()
        
        $connection.Close()
        return $result
    }
    catch {
        Write-Error "Error ejecutando SQL: $($_.Exception.Message)"
        return $null
    }
}

# Función para importar CSV
function Import-CSVToSQL {
    param(
        [string]$CSVPath,
        [string]$TableName,
        [string]$ConnectionString
    )
    
    Write-Host "Importando $CSVPath a tabla $TableName..." -ForegroundColor Green
    
    # Leer CSV
    $data = Import-Csv -Path $CSVPath -Encoding UTF8
    
    if ($data.Count -eq 0) {
        Write-Warning "No hay datos en $CSVPath"
        return
    }
    
    # Crear tabla temporal
    $tempTableName = "#Temp$TableName"
    
    # Generar script de creación de tabla temporal basado en el CSV
    $columns = $data[0].PSObject.Properties.Name
    $createTableSQL = "CREATE TABLE $tempTableName ("
    
    foreach ($column in $columns) {
        $cleanColumn = $column -replace '[^a-zA-Z0-9_]', '_'
        $createTableSQL += "[$cleanColumn] NVARCHAR(MAX), "
    }
    
    $createTableSQL = $createTableSQL.TrimEnd(', ') + ");"
    
    # Ejecutar creación de tabla
    Execute-SQL -Query $createTableSQL -ConnectionString $ConnectionString
    
    # Insertar datos por lotes
    $batchSize = 100
    $totalRows = $data.Count
    $currentBatch = 0
    
    for ($i = 0; $i -lt $totalRows; $i += $batchSize) {
        $currentBatch++
        $endIndex = [Math]::Min($i + $batchSize - 1, $totalRows - 1)
        
        Write-Progress -Activity "Importando datos" -Status "Lote $currentBatch" -PercentComplete (($i / $totalRows) * 100)
        
        $insertSQL = "INSERT INTO $tempTableName VALUES "
        $values = @()
        
        for ($j = $i; $j -le $endIndex; $j++) {
            $row = $data[$j]
            $rowValues = @()
            
            foreach ($column in $columns) {
                $value = $row.$column
                if ([string]::IsNullOrEmpty($value)) {
                    $rowValues += "NULL"
                } else {
                    $escapedValue = $value -replace "'", "''"
                    $rowValues += "'$escapedValue'"
                }
            }
            
            $values += "(" + ($rowValues -join ", ") + ")"
        }
        
        $insertSQL += ($values -join ", ") + ";"
        
        Execute-SQL -Query $insertSQL -ConnectionString $ConnectionString
    }
    
    Write-Progress -Activity "Importando datos" -Completed
    Write-Host "Importación completada: $totalRows filas" -ForegroundColor Green
}

# =============================================
# SCRIPT PRINCIPAL
# =============================================

Write-Host "=== Importador de datos CSV para Proteia ===" -ForegroundColor Cyan

# Construir cadena de conexión
if ([string]::IsNullOrEmpty($Username)) {
    $connectionString = "Server=$ServerName;Database=$DatabaseName;Integrated Security=true;"
} else {
    $connectionString = "Server=$ServerName;Database=$DatabaseName;User Id=$Username;Password=$Password;"
}

Write-Host "Conectando a: $ServerName\$DatabaseName" -ForegroundColor Yellow

# Verificar conexión
try {
    $testConnection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $testConnection.Open()
    $testConnection.Close()
    Write-Host "✓ Conexión exitosa" -ForegroundColor Green
} catch {
    Write-Error "Error de conexión: $($_.Exception.Message)"
    exit 1
}

# Rutas de archivos CSV
$csvFiles = @{
    "ProductsMarket" = "$ProjectPath/data/Products_market.csv"
    "SelectedProducts" = "$ProjectPath/figma/data/Selected_Products_AI.csv"
}

# Verificar que existan los archivos
foreach ($file in $csvFiles.Values) {
    if (-not (Test-Path $file)) {
        Write-Error "Archivo no encontrado: $file"
        exit 1
    }
}

Write-Host "✓ Todos los archivos CSV encontrados" -ForegroundColor Green

# Importar archivos
foreach ($table in $csvFiles.Keys) {
    $csvPath = $csvFiles[$table]
    Import-CSVToSQL -CSVPath $csvPath -TableName $table -ConnectionString $connectionString
}

# Ejecutar scripts de migración
Write-Host "Ejecutando scripts de migración..." -ForegroundColor Yellow

$migrationScripts = @(
    "$ProjectPath/database/01_create_tables.sql",
    "$ProjectPath/database/02_initial_data.sql",
    "$ProjectPath/database/03_migrate_csv_data.sql"
)

foreach ($script in $migrationScripts) {
    if (Test-Path $script) {
        Write-Host "Ejecutando: $script" -ForegroundColor Cyan
        $sqlContent = Get-Content -Path $script -Raw -Encoding UTF8
        Execute-SQL -Query $sqlContent -ConnectionString $connectionString
    } else {
        Write-Warning "Script no encontrado: $script"
    }
}

Write-Host "=== Importación completada ===" -ForegroundColor Green

# Mostrar estadísticas finales
$statsQuery = @"
SELECT 'Products' as TableName, COUNT(*) as RecordCount FROM Products
UNION ALL
SELECT 'NutritionalInfo' as TableName, COUNT(*) as RecordCount FROM NutritionalInfo
UNION ALL
SELECT 'ProductAnalysis' as TableName, COUNT(*) as RecordCount FROM ProductAnalysis
UNION ALL
SELECT 'Categories' as TableName, COUNT(*) as RecordCount FROM Categories
UNION ALL
SELECT 'Brands' as TableName, COUNT(*) as RecordCount FROM Brands
"@

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    
    $command = New-Object System.Data.SqlClient.SqlCommand($statsQuery, $connection)
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
    $dataset = New-Object System.Data.DataSet
    $adapter.Fill($dataset)
    
    Write-Host "`n=== Estadísticas de la Base de Datos ===" -ForegroundColor Cyan
    $dataset.Tables[0] | Format-Table -AutoSize
    
    $connection.Close()
} catch {
    Write-Warning "No se pudieron obtener las estadísticas: $($_.Exception.Message)"
}

Write-Host "Proceso completado exitosamente!" -ForegroundColor Green
