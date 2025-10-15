import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Database, CheckCircle, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { AIRTABLE_CONFIG } from '../utils/airtable-config';
import { airtableService } from '../utils/airtable-service';
import { airtableExtendedService } from '../utils/airtable-extended-service';

interface AirtableConfigurationProps {
  onConfigurationChange?: () => void;
}

export function AirtableConfiguration({ onConfigurationChange }: AirtableConfigurationProps) {
  const [baseId, setBaseId] = useState(AIRTABLE_CONFIG.BASE_ID || '');
  const [tableName, setTableName] = useState(AIRTABLE_CONFIG.TABLE_NAME || 'Proteia');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
  }>({ tested: false, success: false, message: '' });
  
  const [allTablesStatus, setAllTablesStatus] = useState<{
    tested: boolean;
    accessible: string[];
    inaccessible: string[];
    errors: Record<string, string>;
  }>({ tested: false, accessible: [], inaccessible: [], errors: {} });

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Actualizar configuración temporalmente para la prueba
    const originalBaseId = AIRTABLE_CONFIG.BASE_ID;
    const originalTableName = AIRTABLE_CONFIG.TABLE_NAME;
    
    AIRTABLE_CONFIG.BASE_ID = baseId;
    AIRTABLE_CONFIG.TABLE_NAME = tableName;

    try {
      const result = await airtableService.testConnection();
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.message,
        details: result.details
      });

      if (result.success) {
        // Probar acceso a todas las tablas
        const allTablesResult = await airtableExtendedService.checkAllTablesAccess();
        setAllTablesStatus({
          tested: true,
          ...allTablesResult
        });
        
        if (onConfigurationChange) {
          onConfigurationChange();
        }
      }
    } catch (error) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
      
      // Restaurar configuración original en caso de error
      AIRTABLE_CONFIG.BASE_ID = originalBaseId;
      AIRTABLE_CONFIG.TABLE_NAME = originalTableName;
    } finally {
      setIsTestingConnection(false);
    }
  };

  const configStatus = airtableService.getConfigurationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuración de Airtable
        </CardTitle>
        <CardDescription>
          Configure su conexión a Airtable para acceder a datos reales del mercado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status actual */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {configStatus.configured ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <div className="font-medium">
                Estado de Configuración
              </div>
              <div className="text-sm text-muted-foreground">
                {configStatus.message}
              </div>
            </div>
          </div>
          <Badge variant={configStatus.configured ? 'default' : 'secondary'}>
            {configStatus.configured ? 'Configurado' : 'Pendiente'}
          </Badge>
        </div>

        {/* Configuración de API Key */}
        <div className="space-y-2">
          <Label>API Key de Airtable</Label>
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={AIRTABLE_CONFIG.API_KEY ? '••••••••••••••••••••••••••••••••••••••••••••••••••••' : ''}
              readOnly
              className="flex-1"
            />
            <Badge variant={configStatus.apiKey ? 'default' : 'destructive'}>
              {configStatus.apiKey ? 'Configurado' : 'Faltante'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Su API Key está configurado en el sistema
          </p>
        </div>

        {/* Configuración de Base ID */}
        <div className="space-y-2">
          <Label htmlFor="baseId">Base ID de Airtable</Label>
          <Input
            id="baseId"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            placeholder="appXXXXXXXXXXXXX"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Encontrará su Base ID en la URL de su base de Airtable o en la documentación de API
          </p>
        </div>

        {/* Configuración de Tabla */}
        <div className="space-y-2">
          <Label htmlFor="tableName">Nombre de la Tabla</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Proteia"
          />
          <p className="text-xs text-muted-foreground">
            Nombre exacto de la tabla que contiene los datos de productos
          </p>
        </div>

        {/* Botón de prueba */}
        <Button 
          onClick={handleTestConnection}
          disabled={isTestingConnection || !baseId.trim()}
          className="w-full"
        >
          {isTestingConnection ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Probando Conexión...
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Probar Conexión
            </>
          )}
        </Button>

        {/* Resultado de la prueba */}
        {connectionStatus.tested && (
          <Alert variant={connectionStatus.success ? 'default' : 'destructive'}>
            <div className="flex items-center gap-2">
              {connectionStatus.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="font-medium">
                  {connectionStatus.success ? 'Conexión Exitosa' : 'Error de Conexión'}
                </div>
                <div className="text-sm mt-1">
                  {connectionStatus.message}
                </div>
                {connectionStatus.details && connectionStatus.success && (
                  <div className="text-xs mt-2 font-mono bg-muted p-2 rounded">
                    Base: {connectionStatus.details.baseId}<br />
                    Tabla: {connectionStatus.details.tableName}<br />
                    Registros encontrados: {connectionStatus.details.recordCount}
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Estado de todas las tablas */}
        {allTablesStatus.tested && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado de Acceso a Tablas Especializadas</CardTitle>
              <CardDescription>
                Verificación de acceso a todas las tablas de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allTablesStatus.accessible.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-green-700 mb-2">✅ Tablas Accesibles ({allTablesStatus.accessible.length})</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {allTablesStatus.accessible.map((table) => (
                      <Badge key={table} variant="default" className="text-xs">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {allTablesStatus.inaccessible.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-amber-700 mb-2">⚠️ Tablas No Accesibles ({allTablesStatus.inaccessible.length})</h4>
                  <div className="space-y-2">
                    {allTablesStatus.inaccessible.map((table) => (
                      <div key={table} className="text-xs">
                        <Badge variant="destructive" className="text-xs mr-2">{table}</Badge>
                        <span className="text-muted-foreground">{allTablesStatus.errors[table]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <div><strong>Nota:</strong> Las tablas no accesibles usarán datos de demostración.</div>
                <div>El sistema funcionará completamente independientemente del acceso a estas tablas.</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        {!configStatus.configured && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Modo Demostración Activo</div>
              <div className="text-sm">
                Mientras no esté configurado Airtable, el sistema funcionará con datos de demostración.
                Para acceder a sus datos reales, configure su Base ID arriba y pruebe la conexión.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error de permisos específico */}
        {connectionStatus.tested && !connectionStatus.success && connectionStatus.message.includes('Permisos insuficientes') && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Error de Permisos de Airtable</div>
              <div className="text-sm mb-2">
                Su API Key no tiene permisos de lectura para esta base. Para solucionarlo:
              </div>
              <div className="text-sm space-y-1">
                <div>1. Vaya a <a href="https://airtable.com/account" target="_blank" rel="noopener noreferrer" className="underline">https://airtable.com/account</a></div>
                <div>2. Encuentre su API Key y edite los permisos</div>
                <div>3. Asegúrese de dar permisos de LECTURA a la base: <code className="bg-muted px-1 rounded">{baseId}</code></div>
                <div>4. O genere un nuevo API Key con los permisos correctos</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Guía completa */}
        <div className="pt-4 border-t space-y-4">
          <div>
            <h4 className="font-medium mb-2">¿Cómo encontrar su Base ID?</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>1. Vaya a su base en Airtable</div>
              <div>2. Mire la URL: <code className="bg-muted px-1 rounded">https://airtable.com/appXXXXXXXXXXXXX/...</code></div>
              <div>3. El <code className="bg-muted px-1 rounded">appXXXXXXXXXXXXX</code> es su Base ID</div>
              <div>4. O vaya a Help → API documentation en su base</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">¿Error de permisos?</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>1. Vaya a <a href="https://airtable.com/account" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://airtable.com/account</a></div>
              <div>2. Busque su API Key y verifique los permisos</div>
              <div>3. Asegúrese de que tenga permisos de <strong>LECTURA</strong> para su base</div>
              <div>4. Si no funciona, genere un nuevo API Key con los permisos correctos</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">¿La tabla no se encuentra?</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>1. Verifique que el nombre de la tabla sea exacto: <strong>"{tableName}"</strong></div>
              <div>2. Los nombres son sensibles a mayúsculas/minúsculas</div>
              <div>3. Si su tabla tiene otro nombre, cámbielo arriba</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}