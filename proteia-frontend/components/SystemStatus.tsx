import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { airtableService } from '../utils/airtable-service.tsx';
import { AIRTABLE_CONFIG } from '../utils/airtable-config.tsx';
import { Database, CheckCircle, RefreshCw, Calendar, AlertTriangle } from 'lucide-react';

export function SystemStatus() {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    configured: boolean;
    productCount: number;
    lastUpdate: string;
    message: string;
    details?: any;
  }>({
    connected: false,
    configured: false,
    productCount: 0,
    lastUpdate: '',
    message: 'Verificando conexión...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    try {
      // Primero verificar la configuración
      const configStatus = airtableService.getConfigurationStatus();
      
      if (!configStatus.configured) {
        setConnectionStatus({
          connected: false,
          configured: false,
          productCount: 0,
          lastUpdate: new Date().toLocaleString('es-MX'),
          message: configStatus.message,
          details: { configStatus }
        });
        return;
      }

      // Probar la conexión
      const testResult = await airtableService.testConnection();
      
      if (testResult.success) {
        // Si la conexión es exitosa, obtener productos
        const products = await airtableService.getAllProducts();
        setConnectionStatus({
          connected: true,
          configured: true,
          productCount: products.length,
          lastUpdate: new Date().toLocaleString('es-MX'),
          message: `Conectado exitosamente. ${products.length} productos disponibles.`,
          details: testResult.details
        });
      } else {
        setConnectionStatus({
          connected: false,
          configured: true,
          productCount: 0,
          lastUpdate: new Date().toLocaleString('es-MX'),
          message: testResult.message,
          details: testResult.details
        });
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        configured: true,
        productCount: 0,
        lastUpdate: new Date().toLocaleString('es-MX'),
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: { error }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Estado del Sistema 2025
        </CardTitle>
        <CardDescription>
          Configuración y estado de conexión con fuentes de datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de conexión principal */}
        <Alert className={connectionStatus.connected ? "border-green-200" : (connectionStatus.configured ? "border-red-200" : "border-yellow-200")}>
          {connectionStatus.connected ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          )}
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Base de Datos Principal:</span>
                <Badge variant={connectionStatus.connected ? "default" : "destructive"}>
                  {connectionStatus.connected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
              
              {!connectionStatus.configured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                  <p className="text-sm text-yellow-800 font-medium">⚠️ Configuración Requerida</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Configure las variables de entorno AIRTABLE_API_KEY y AIRTABLE_BASE_ID para conectar con Airtable.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">API Key:</span>
                  <br />
                  <code className="text-xs">
                    {AIRTABLE_CONFIG.API_KEY ? '***********' + AIRTABLE_CONFIG.API_KEY.slice(-6) : 'No configurado'}
                  </code>
                </div>
                <div>
                  <span className="text-muted-foreground">Base ID:</span>
                  <br />
                  <code className="text-xs">
                    {AIRTABLE_CONFIG.BASE_ID || 'No configurado'}
                  </code>
                </div>
                <div>
                  <span className="text-muted-foreground">Tabla:</span>
                  <br />
                  <code className="text-xs">{AIRTABLE_CONFIG.TABLE_NAME}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Productos:</span>
                  <br />
                  <span className="font-medium">{connectionStatus.productCount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <span>Última verificación: {connectionStatus.lastUpdate}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Configuración del sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Versión Sistema
            </h4>
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Año:</span>
                  <Badge variant="secondary">2025</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Enfoque:</span>
                  <span>México</span>
                </div>
                <div className="flex justify-between">
                  <span>Producto:</span>
                  <span>Proteo50</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuente:</span>
                  <span>Airtable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Capacidades Activas</h4>
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="space-y-2">
                {[
                  { feature: 'Análisis de Mercado', status: true },
                  { feature: 'Comparación de Productos', status: true },
                  { feature: 'Ranking de Prospectos', status: true },
                  { feature: 'Narrativas Comerciales', status: true },
                  { feature: 'Datos en Tiempo Real', status: connectionStatus.connected }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.feature}</span>
                    <Badge variant={item.status ? "default" : "secondary"} className="text-xs">
                      {item.status ? "Activo" : "Limitado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            {connectionStatus.message}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}