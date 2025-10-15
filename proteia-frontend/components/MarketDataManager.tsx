import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { airtableService, MarketProduct } from '../utils/airtable-service.tsx';
import { AIRTABLE_CONFIG } from '../utils/airtable-config.tsx';
import { AirtableSetupGuide } from './AirtableSetupGuide.tsx';
import { Database, Search, Package, TrendingUp, Star, DollarSign, RefreshCw, AlertTriangle, Settings } from 'lucide-react';
import { toast } from 'sonner';

export function MarketDataManager() {
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [marketStats, setMarketStats] = useState({
    totalProducts: 0,
    avgPrice: 0,
    avgRating: 0,
    topBrands: [] as string[]
  });
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setConnectionError('');

    // Verificar configuración antes de intentar conectar
    const configStatus = airtableService.getConfigurationStatus();
    if (!configStatus.configured) {
      setConnectionError(configStatus.message);
      setShowSetupGuide(true);
      setLoading(false);
      return;
    }

    try {
      const allProducts = await airtableService.getAllProducts();
      setProducts(allProducts);
      
      // Calcular estadísticas
      if (allProducts.length > 0) {
        const avgPrice = allProducts.reduce((sum, p) => sum + p.precio, 0) / allProducts.length;
        const avgRating = allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length;
        
        const brandCounts = new Map<string, number>();
        allProducts.forEach(p => {
          brandCounts.set(p.marca, (brandCounts.get(p.marca) || 0) + 1);
        });
        
        const topBrands = Array.from(brandCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([brand]) => brand);

        setMarketStats({
          totalProducts: allProducts.length,
          avgPrice,
          avgRating,
          topBrands
        });
      }
      
      toast.success(`✅ Cargados ${allProducts.length} productos de Airtable`);
      setShowSetupGuide(false);
    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setConnectionError(errorMessage);
      toast.error(`❌ Error: ${errorMessage}`);
      
      // Si hay un error de configuración, mostrar la guía
      if (errorMessage.includes('API Key') || errorMessage.includes('Base ID') || errorMessage.includes('404') || errorMessage.includes('401')) {
        setShowSetupGuide(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }

    setSearching(true);
    try {
      const searchResults = await airtableService.searchProducts(searchQuery);
      setProducts(searchResults);
      toast.success(`Encontrados ${searchResults.length} productos`);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error en la búsqueda');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadData();
  };

  // Si hay errores de configuración, mostrar la guía
  if (showSetupGuide) {
    return (
      <div className="space-y-6">
        {connectionError && (
          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-red-800">Error de Configuración</p>
                <p className="text-red-700">{connectionError}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSetupGuide(false)}
                  className="mt-2"
                >
                  Ocultar Guía
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <AirtableSetupGuide />
        <div className="flex justify-center">
          <Button onClick={loadData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Intentar Conexión Nuevamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Conectando con Airtable...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="data">Gestión de Datos</TabsTrigger>
          <TabsTrigger value="setup">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.totalProducts.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Mercado México 2025</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Precio Promedio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${marketStats.avgPrice.toFixed(0)} MXN</div>
                <p className="text-xs text-muted-foreground">Promedio general</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Rating Promedio</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.avgRating.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground">Calificación media</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Marcas Top</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.topBrands.length}</div>
                <p className="text-xs text-muted-foreground">Líderes del mercado</p>
              </CardContent>
            </Card>
          </div>

          {/* Estado de conexión */}
          <Alert className="border-green-200">
            <Database className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estado de la Conexión:</span>
                  <Badge variant="default">Conectado</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Base ID:</span>
                    <br />
                    <code className="text-xs">{AIRTABLE_CONFIG.BASE_ID}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tabla:</span>
                    <br />
                    <code className="text-xs">{AIRTABLE_CONFIG.TABLE_NAME}</code>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Herramientas de búsqueda y gestión */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestión de Datos de Mercado México 2025
              </CardTitle>
              <CardDescription>
                Conectado a Airtable • {products.length} productos disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Búsqueda */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar productos, marcas, categorías..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={searching}
                  className="flex items-center gap-2"
                >
                  {searching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Buscar
                </Button>
                {searchQuery && (
                  <Button variant="outline" onClick={clearSearch}>
                    Limpiar
                  </Button>
                )}
                <Button variant="outline" onClick={loadData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de productos */}
          {products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Productos del Mercado</CardTitle>
                <CardDescription>
                  {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los productos disponibles'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {products.slice(0, 20).map((product) => (
                    <div key={product.id || product.asin} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.nombre_producto}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{product.marca}</span>
                            <span>•</span>
                            <span>{product.categoria}</span>
                            <span>•</span>
                            <span>${product.precio.toFixed(0)} MXN</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{product.rating.toFixed(1)}</span>
                              <span>({product.num_reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{product.asin}</Badge>
                          {product.disponibilidad && (
                            <Badge variant="secondary">{product.disponibilidad}</Badge>
                          )}
                        </div>
                      </div>
                      {product.descripcion && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {product.descripcion}
                        </p>
                      )}
                    </div>
                  ))}
                  {products.length > 20 && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Mostrando 20 de {products.length} productos. Use la búsqueda para filtrar.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="setup">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Configuración de Airtable</h3>
                <p className="text-sm text-muted-foreground">
                  Gestione la conexión y configuración de su base de datos
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {showSetupGuide ? 'Ocultar Guía' : 'Mostrar Guía de Configuración'}
              </Button>
            </div>
            
            {showSetupGuide && <AirtableSetupGuide />}
            
            <Card>
              <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
                <CardDescription>
                  Información sobre la configuración actual del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Key:</span>
                      <Badge variant={AIRTABLE_CONFIG.API_KEY ? "default" : "destructive"}>
                        {AIRTABLE_CONFIG.API_KEY ? 'Configurado' : 'Faltante'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Base ID:</span>
                      <Badge variant={AIRTABLE_CONFIG.BASE_ID ? "default" : "destructive"}>
                        {AIRTABLE_CONFIG.BASE_ID ? 'Configurado' : 'Faltante'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tabla:</span>
                      <Badge variant="default">{AIRTABLE_CONFIG.TABLE_NAME}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Productos cargados:</span>
                      <span className="font-medium">{products.length.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Última actualización:</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button onClick={loadData} className="w-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Probar Conexión
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}