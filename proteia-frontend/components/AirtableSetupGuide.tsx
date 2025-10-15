import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  Database, 
  ExternalLink, 
  Key, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Eye
} from 'lucide-react';

export function AirtableSetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Guía Completa de Configuración de Airtable
          </CardTitle>
          <CardDescription>
            Siga estos pasos para conectar sus datos reales de Airtable al sistema
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Paso 1: Obtener API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Paso 1: Obtener API Key de Airtable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Vaya a su cuenta de Airtable</p>
              <p className="text-sm text-muted-foreground">
                Abra <a href="https://airtable.com/account" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
                  https://airtable.com/account <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Genere un nuevo API Key</p>
              <p className="text-sm text-muted-foreground mb-2">
                Haga clic en "Generate API Key" o busque la sección "API"
              </p>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> El API Key ya está configurado en el sistema con el token que proporcionó.
                  Solo necesita verificar que tenga los permisos correctos.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Configure los permisos</p>
              <p className="text-sm text-muted-foreground mb-2">
                Asegúrese de que su API Key tenga los siguientes permisos:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Permisos de <strong>LECTURA</strong> (Read) para su base</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Acceso a la tabla "Proteia"</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">NO necesita permisos de escritura para este sistema</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paso 2: Obtener Base ID */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Paso 2: Obtener Base ID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Abra su base en Airtable</p>
              <p className="text-sm text-muted-foreground">
                Vaya a la base que contiene la tabla "Proteia"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Copie el Base ID de la URL</p>
              <p className="text-sm text-muted-foreground mb-2">
                Mire la URL de su navegador:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                https://airtable.com/<span className="bg-primary/20 px-1 rounded">appBDqjLNx8YD2JX9</span>/tblXXXXXXXXXXXXX/...
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                El Base ID es la parte que empieza con "app" (en este ejemplo: <code>appBDqjLNx8YD2JX9</code>)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Método alternativo</p>
              <p className="text-sm text-muted-foreground">
                En su base, vaya a "Help" → "API documentation" para encontrar el Base ID
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paso 3: Verificar tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Paso 3: Verificar Estructura de la Tabla
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Confirme el nombre de la tabla</p>
              <p className="text-sm text-muted-foreground">
                La tabla debe llamarse exactamente <Badge variant="outline">"Proteia"</Badge> (sensible a mayúsculas)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Campos recomendados en la tabla</p>
              <p className="text-sm text-muted-foreground mb-2">
                Para mejores resultados, su tabla debería incluir campos como:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Product Name / nombre_producto</div>
                <div>• Brand / marca</div>
                <div>• Category / categoria</div>
                <div>• Price / precio</div>
                <div>• Rating / rating</div>
                <div>• ASIN</div>
                <div>• Description / descripcion</div>
                <div>• Image URL / imagen</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paso 4: Configurar en el sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paso 4: Configurar en el Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Vaya a la pestaña "Configuración Airtable"</p>
              <p className="text-sm text-muted-foreground">
                En la pestaña "General Data", seleccione "Configuración Airtable"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Ingrese su Base ID</p>
              <p className="text-sm text-muted-foreground">
                Pegue el Base ID que copió en el Paso 2
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Pruebe la conexión</p>
              <p className="text-sm text-muted-foreground">
                Haga clic en "Probar Conexión" para verificar que todo funcione
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solución de problemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Solución de Problemas Comunes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Error: "Permisos insuficientes"</div>
              <div className="text-sm space-y-1">
                <div>• Vaya a https://airtable.com/account</div>
                <div>• Edite su API Key y asegúrese de dar permisos de LECTURA a su base</div>
                <div>• Si no funciona, genere un nuevo API Key</div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-medium mb-1">Error: "Base ID no encontrado"</div>
              <div className="text-sm space-y-1">
                <div>• Verifique que el Base ID sea correcto (empieza con "app")</div>
                <div>• Asegúrese de que tenga acceso a esa base</div>
                <div>• Copie el Base ID directamente de la URL</div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-medium mb-1">Error: "Tabla no encontrada"</div>
              <div className="text-sm space-y-1">
                <div>• Verifique que la tabla se llame exactamente "Proteia"</div>
                <div>• Los nombres son sensibles a mayúsculas/minúsculas</div>
                <div>• Si su tabla tiene otro nombre, cámbielo en la configuración</div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-1">Sistema Funcionando en Modo Demo</div>
          <div className="text-sm">
            Mientras configura Airtable, el sistema funciona perfectamente con datos de demostración. 
            Todas las funcionalidades están disponibles para que pueda probar el sistema.
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}