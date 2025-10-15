import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, Users, Target, TrendingUp, Star, DollarSign } from 'lucide-react';
import { categoryData, mexicanBrands } from '../data/mexico-market-data';
import { MarketDataManager } from './MarketDataManager';
import { SystemStatus } from './SystemStatus';
import { AirtableConfiguration } from './AirtableConfiguration';
import { AirtableSetupGuide } from './AirtableSetupGuide';
import { airtableService, MarketProduct } from '../utils/airtable-service.tsx';

export function MarketOverview() {
  const [realMarketProducts, setRealMarketProducts] = useState<MarketProduct[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Datos mock para el análisis básico del mercado mexicano
  const marketShare = mexicanBrands
    .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))
    .slice(0, 5)
    .map((brand, index) => ({
      name: brand.name,
      value: brand.marketShare || 0,
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index]
    }));

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      // Verificar si Airtable está configurado
      const configStatus = airtableService.getConfigurationStatus();
      if (!configStatus.configured) {
        console.warn('Airtable no configurado, usando datos por defecto');
        setLoading(false);
        return;
      }

      // Cargar productos reales de Airtable
      const products = await airtableService.getAllProducts();
      setRealMarketProducts(products);

      // Cargar análisis de mercado
      const analysis = await airtableService.getMarketAnalysis();
      setMarketAnalysis(analysis);
    } catch (error) {
      console.error('Error loading market data:', error);
      // No bloquear la interfaz si hay errores de Airtable
    } finally {
      setLoading(false);
    }
  };

  const realMarketAnalysis = () => {
    if (!realMarketProducts.length) return null;

    const brandCount = new Map();
    const categoryCount = new Map();
    const priceData: number[] = [];

    realMarketProducts.forEach(product => {
      // Contar marcas
      const brand = product.marca || 'Sin marca';
      brandCount.set(brand, (brandCount.get(brand) || 0) + 1);

      // Contar categorías
      const category = product.categoria || 'Sin categoría';
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);

      // Recopilar precios
      if (product.precio > 0) {
        priceData.push(product.precio);
      }
    });

    const topBrands = Array.from(brandCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        value: count,
        color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index]
      }));

    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        count
      }));

    const avgPrice = priceData.length > 0 ? priceData.reduce((a, b) => a + b, 0) / priceData.length : 0;
    const avgRating = realMarketProducts.length > 0 
      ? realMarketProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / realMarketProducts.length 
      : 0;

    return {
      topBrands,
      topCategories,
      avgPrice,
      avgRating,
      totalProducts: realMarketProducts.length,
      totalBrands: brandCount.size,
      totalCategories: categoryCount.size
    };
  };

  const analysis = realMarketAnalysis();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="market-overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market-overview">Análisis de Mercado México 2025</TabsTrigger>
          <TabsTrigger value="data-management">Gestión de Datos</TabsTrigger>
          <TabsTrigger value="airtable-config">Configuración Airtable</TabsTrigger>
          <TabsTrigger value="setup-guide">Guía de Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="market-overview" className="space-y-6">
          {/* Estado de conexión de Airtable */}
          {!airtableService.getConfigurationStatus().configured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">Usando Datos de Demostración</div>
                    <div className="text-sm">
                      Para conectar sus datos reales de Airtable, vaya a la pestaña "Configuración Airtable" y configure su Base ID.
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* KPI Cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Productos Activos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysis ? analysis.totalProducts.toLocaleString() : categoryData.reduce((sum, cat) => sum + cat.products, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analysis ? 'Datos reales Airtable' : 'Datos de referencia'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Marcas Únicas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysis ? analysis.totalBrands : mexicanBrands.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analysis ? 'Marcas identificadas' : 'Marcas principales'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Precio Promedio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analysis ? analysis.avgPrice.toFixed(0) : '485'} MXN
                </div>
                <p className="text-xs text-muted-foreground">
                  Mercado general
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Rating Promedio</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysis ? analysis.avgRating.toFixed(1) : '4.2'}/5
                </div>
                <p className="text-xs text-muted-foreground">
                  Calificación media
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorías principales */}
            <Card>
              <CardHeader>
                <CardTitle>Categorías Principales México</CardTitle>
                <CardDescription>
                  {analysis ? 'Análisis basado en datos reales' : 'Distribución por número de productos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysis ? analysis.topCategories : categoryData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey={analysis ? "count" : "products"}
                      fill="#8884d8" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Share */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {analysis ? 'Top Marcas por Productos' : 'Share de Mercado — Top Marcas México'}
                </CardTitle>
                <CardDescription>
                  {analysis ? 'Basado en número de productos' : 'Participación estimada del mercado'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analysis ? analysis.topBrands : marketShare}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}${analysis ? '' : '%'}`}
                    >
                      {(analysis ? analysis.topBrands : marketShare).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Información de oportunidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Oportunidades Identificadas para Proteo50 México 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Segmentos de Alto Potencial</h4>
                  <div className="space-y-2">
                    {[
                      { segment: 'Proteínas Deportivas', opportunity: 85, trend: '+12%' },
                      { segment: 'Suplementos Funcionales', opportunity: 72, trend: '+18%' },
                      { segment: 'Nutracéuticos Premium', opportunity: 68, trend: '+25%' },
                      { segment: 'Productos Veganos', opportunity: 61, trend: '+31%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="text-sm font-medium">{item.segment}</span>
                          <Badge className="ml-2" variant="secondary">{item.trend}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.opportunity} className="w-16" />
                          <span className="text-sm text-muted-foreground">{item.opportunity}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Factores Clave de Éxito</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Certificaciones locales (COFEPRIS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Posicionamiento premium con beneficios claros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Estrategia multicanal (Amazon MX + retail)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Adaptación cultural del mensaje</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-management" className="space-y-6">
          <MarketDataManager />
        </TabsContent>

        <TabsContent value="airtable-config" className="space-y-6">
          <AirtableConfiguration onConfigurationChange={loadMarketData} />
        </TabsContent>

        <TabsContent value="setup-guide" className="space-y-6">
          <AirtableSetupGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}