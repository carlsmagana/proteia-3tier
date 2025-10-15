import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { TrendingUp, Package, DollarSign, Star, BarChart3 } from 'lucide-react';
import { OpportunityMatrix } from './charts/OpportunityMatrix';
import { BrandRevenueTreemap } from './charts/BrandRevenueTreemap';
import { PriceDistributionChart } from './charts/PriceDistributionChart';
import {
  ConsolidatedProduct,
  calculateMarketMetrics,
  loadConsolidatedProducts,
  loadProductAnalysis,
  processConsolidatedData
} from '../data/consolidated-products';

interface ProductDiversityDashboardProps {
  csvData?: string;
}

export function ProductDiversityDashboard({ csvData }: ProductDiversityDashboardProps) {
  const [products, setProducts] = useState<ConsolidatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Si hay datos CSV, procesarlos
  useEffect(() => {
    let isSubscribed = true;

    const hydrateProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (csvData) {
          const analysis = await loadProductAnalysis();
          const processed = processConsolidatedData(csvData, analysis);
          if (isSubscribed) {
            setProducts(processed);
          }
        } else {
          const loaded = await loadConsolidatedProducts();
          if (isSubscribed) {
            setProducts(loaded);
          }
        }
      } catch (err) {
        console.error('Error loading market data', err);
        if (isSubscribed) {
          setError('No pudimos cargar los datos de mercado. Intenta nuevamente.');
          setProducts([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    hydrateProducts();

    return () => {
      isSubscribed = false;
    };
  }, [csvData]);

  const hasData = products.length > 0;
  const metrics = hasData ? calculateMarketMetrics(products) : null;

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {trend && (
              <Badge variant="secondary" className="mt-2">
                {trend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Procesando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Error al cargar datos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Sin datos disponibles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Verifica que los archivos CSV estén en la carpeta <code>data/</code> y recarga el dashboard.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Diversidad de Productos - Mercado Mexicano
        </h1>
        <p className="text-muted-foreground">
          Análisis de productos de proteína consolidados para identificar oportunidades de mercado para Proteo
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Productos"
          value={metrics.totalProducts.toLocaleString()}
          subtitle="En el mercado"
          icon={Package}
          trend="Activo"
        />
        <MetricCard
          title="Marcas Únicas"
          value={metrics.uniqueBrands}
          subtitle="Diferentes fabricantes"
          icon={BarChart3}
          trend={`${metrics.totalProducts ? ((metrics.uniqueBrands / metrics.totalProducts) * 100).toFixed(0) : 0}% diversidad`}
        />
        <MetricCard
          title="Precio Promedio"
          value={`$${metrics.avgPrice.toFixed(0)}`}
          subtitle="MXN"
          icon={DollarSign}
          trend="Rango amplio"
        />
        <MetricCard
          title="Precio Promedio / kg"
          value={metrics.avgPricePerKg ? `$${metrics.avgPricePerKg.toFixed(0)}` : 'N/D'}
          subtitle="MXN por kilogramo"
          icon={DollarSign}
          trend={metrics.avgPricePerKg ? `≈ $${metrics.avgPricePerKg.toFixed(0)} / kg` : 'Sin peso registrado'}
        />
        <MetricCard
          title="Rating Promedio"
          value={metrics.avgRating.toFixed(1)}
          subtitle="de 5.0"
          icon={Star}
          trend="Alta satisfacción"
        />
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="opportunity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunity">Matriz de Oportunidades</TabsTrigger>
          <TabsTrigger value="brands">Análisis de Marcas</TabsTrigger>
          <TabsTrigger value="pricing">Distribución de Precios</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunity" className="space-y-4">
          <OpportunityMatrix data={products} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Insights de Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• <strong>Zona dorada:</strong> Productos con alta demanda (ventas) y precios premium</p>
                <p>• <strong>Oportunidad Proteo:</strong> Posicionarse en productos con buen rating pero bajo margen</p>
                <p>• <strong>Mercado activo:</strong> {products.filter(p => p.estSales > 1000).length} productos con +1k ventas mensuales</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-4">
          <BrandRevenueTreemap data={products} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Marcas por Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.brandDistribution)
                    .sort(([, a]: any, [, b]: any) => b.totalRevenue - a.totalRevenue)
                    .slice(0, 5)
                    .map(([brand, data]: any, idx) => (
                      <div key={brand} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{brand.substring(0, 20)}...</span>
                        <div className="text-right">
                          <p className="font-semibold">${(data.totalRevenue / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">{data.products} productos</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Potencial de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-green-600">Alta Prioridad</p>
                    <p className="text-xs">Marcas con productos premium y alta demanda</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Media Prioridad</p>
                    <p className="text-xs">Marcas establecidas con cartera diversa</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-600">Emergentes</p>
                    <p className="text-xs">Nuevas marcas con crecimiento acelerado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <PriceDistributionChart data={products} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segmento Económico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.price < 500).length}
                  </p>
                  <p className="text-muted-foreground">Productos &lt; $500</p>
                  <p className="text-xs">Alta competencia en precio</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segmento Medio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-2xl font-bold text-blue-600">
                    {products.filter(p => p.price >= 500 && p.price < 1500).length}
                  </p>
                  <p className="text-muted-foreground">$500 - $1,500</p>
                  <p className="text-xs">Balance precio-calidad</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segmento Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-2xl font-bold text-purple-600">
                    {products.filter(p => p.price >= 1500).length}
                  </p>
                  <p className="text-muted-foreground">$1,500+</p>
                  <p className="text-xs">Oportunidad Proteo50</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumen Ejecutivo para Proteo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Amplitud del Mercado</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {metrics.totalProducts} productos activos en el mercado</li>
                <li>• {metrics.uniqueBrands} marcas diferentes operando</li>
                <li>• Revenue total estimado: ${(metrics.totalRevenue / 1000000).toFixed(0)}M MXN</li>
                <li>• Precio medio por kg: {metrics.avgPricePerKg ? `$${metrics.avgPricePerKg.toFixed(0)}` : 'N/D'}</li>
                <li>• Satisfacción promedio: {metrics.avgRating.toFixed(1)}/5 (alta confianza del consumidor)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Oportunidades para Proteo50</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Segmento premium con márgenes atractivos</li>
                <li>• Marcas establecidas como socios potenciales</li>
                <li>• Diversidad de aplicaciones (salud y alimentos)</li>
                <li>• Mercado maduro con demanda comprobada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
