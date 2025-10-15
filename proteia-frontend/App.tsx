import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { MarketOverview } from './components/MarketOverview';
import { CombinedProductComparison } from './components/CombinedProductComparison';
import { ProspectRanking } from './components/ProspectRanking';
import { ProductDiversityDashboard } from './components/ProductDiversityDashboard';
import { Login } from './components/Login';
import { Building2, TrendingUp, LogOut, Database, AlertTriangle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { airtableService } from './utils/airtable-service';

export default function App() {
  const [activeTab, setActiveTab] = useState('diversity');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estado de configuración de Airtable
  const airtableStatus = airtableService.getConfigurationStatus();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1>Inteligencia Comercial</h1>
                <p className="text-muted-foreground">Enfoque México — Proteo50 (2025)</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 text-chart-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Mercado Activo</span>
              </div>
              
              {/* Indicador de estado de Airtable */}
              <div className="flex items-center gap-2">
                {airtableStatus.configured ? (
                  <Database className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <Badge variant={airtableStatus.configured ? 'default' : 'secondary'} className="text-xs">
                  {airtableStatus.configured ? 'Airtable Conectado' : 'Modo Demo'}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="diversity">Diversidad de Productos</TabsTrigger>
            <TabsTrigger value="general-data">General Data</TabsTrigger>
            <TabsTrigger value="product-comparison">Product Comparison</TabsTrigger>
            <TabsTrigger value="prospects">Prospectos</TabsTrigger>
          </TabsList>

          <TabsContent value="diversity" className="space-y-6">
            <ProductDiversityDashboard />
          </TabsContent>

          <TabsContent value="general-data" className="space-y-6">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="product-comparison" className="space-y-6">
            <CombinedProductComparison />
          </TabsContent>

          <TabsContent value="prospects" className="space-y-6">
            <ProspectRanking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}