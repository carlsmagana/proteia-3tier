import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  clientProducts, 
  compareClientProducts, 
  analyzeMarketCompatibility,
  getPortfolioMetrics,
  ClientProduct 
} from '../data/client-products';

export function ClientProductComparison() {
  const [selectedProductA, setSelectedProductA] = useState<string>(clientProducts[0]?.id || '');
  const [selectedProductB, setSelectedProductB] = useState<string>('');
  const [viewMode, setViewMode] = useState<'single' | 'comparison'>('single');

  const productA = clientProducts.find(p => p.id === selectedProductA);
  const productB = clientProducts.find(p => p.id === selectedProductB);
  const portfolioMetrics = getPortfolioMetrics();

  const comparison = productA && productB ? compareClientProducts(productA, productB) : null;
  const marketAnalysis = productA ? analyzeMarketCompatibility(productA) : null;

  const createRadarData = (product: ClientProduct) => {
    // Función auxiliar para obtener valor numérico
    const getNumericValue = (value: number | string): number => {
      return typeof value === 'string' ? 0 : value;
    };

    return [
      { subject: 'Proteína', value: Math.min(getNumericValue(product.nutritionalProfile.protein), 50), fullMark: 50 },
      { subject: 'Fibra', value: getNumericValue(product.nutritionalProfile.fiber), fullMark: 35 },
      { subject: 'Energía/10', value: getNumericValue(product.nutritionalProfile.energy) / 10, fullMark: 40 },
      { subject: 'Grasa', value: getNumericValue(product.nutritionalProfile.fat), fullMark: 15 },
      { subject: 'Carbohidratos', value: getNumericValue(product.nutritionalProfile.carbohydrates), fullMark: 25 },
      { subject: 'β-Glucano', value: getNumericValue(product.nutritionalProfile.betaGlucano || 0), fullMark: 20 }
    ];
  };

  const createCombinedRadarData = (productA: ClientProduct, productB: ClientProduct) => {
    const dataA = createRadarData(productA);
    const dataB = createRadarData(productB);
    
    return dataA.map((item, index) => ({
      subject: item.subject,
      [productA.name]: item.value,
      [productB.name]: dataB[index].value,
      fullMark: item.fullMark
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'default';
      case 'testing': return 'secondary';
      case 'development': return 'outline';
      case 'planned': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'production': return 'Producción';
      case 'testing': return 'Pruebas';
      case 'development': return 'Desarrollo';
      case 'planned': return 'Planeado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Comparación de Productos del Cliente
              </CardTitle>
              <CardDescription>
                Análisis y comparación del portafolio de productos en desarrollo
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('single')}
              >
                Análisis Individual
              </Button>
              <Button 
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('comparison')}
              >
                Comparación
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="font-medium">Total Productos</span>
            </div>
            <div className="text-2xl font-bold">{portfolioMetrics.totalProducts}</div>
            <div className="text-xs text-muted-foreground">En portafolio activo</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="font-medium">En Desarrollo</span>
            </div>
            <div className="text-2xl font-bold">{portfolioMetrics.developmentPipeline}</div>
            <div className="text-xs text-muted-foreground">Pipeline activo</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span className="font-medium">En Producción</span>
            </div>
            <div className="text-2xl font-bold">{portfolioMetrics.productionReady}</div>
            <div className="text-xs text-muted-foreground">Listos para mercado</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Categorías</span>
            </div>
            <div className="text-2xl font-bold">{Object.keys(portfolioMetrics.categoryDistribution).length}</div>
            <div className="text-xs text-muted-foreground">Segmentos cubiertos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">β-Glucano Prom.</span>
            </div>
            <div className="text-2xl font-bold">{portfolioMetrics.nutritionalAverages.betaGlucano.toFixed(1)}g</div>
            <div className="text-xs text-muted-foreground">Diferenciador clave</div>
          </CardContent>
        </Card>
      </div>

      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selección de Productos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Producto Principal</label>
              <Select value={selectedProductA} onValueChange={setSelectedProductA}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {clientProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(product.status)} className="text-xs">
                          {getStatusLabel(product.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">({product.category})</span>
                        {product.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {viewMode === 'comparison' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Producto a Comparar</label>
                <Select value={selectedProductB} onValueChange={setSelectedProductB}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientProducts
                      .filter(p => p.id !== selectedProductA)
                      .map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(product.status)} className="text-xs">
                              {getStatusLabel(product.status)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">({product.category})</span>
                            {product.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Single Product Analysis */}
      {viewMode === 'single' && productA && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {productA.name}
                    <Badge variant={getStatusColor(productA.status)}>
                      {getStatusLabel(productA.status)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{productA.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{productA.category}</Badge>
                </div>
                <h4 className="font-medium mb-2">Perfil Nutricional (por 100g)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Energía:</span>
                    <span className="font-medium">{productA.nutritionalProfile.energy} {typeof productA.nutritionalProfile.energy === 'number' ? 'kcal' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proteína:</span>
                    <span className="font-medium">{productA.nutritionalProfile.protein}{typeof productA.nutritionalProfile.protein === 'number' ? 'g' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fibra:</span>
                    <span className="font-medium">{productA.nutritionalProfile.fiber}{typeof productA.nutritionalProfile.fiber === 'number' ? 'g' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grasa:</span>
                    <span className="font-medium">{productA.nutritionalProfile.fat}{typeof productA.nutritionalProfile.fat === 'number' ? 'g' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbohidratos:</span>
                    <span className="font-medium">{productA.nutritionalProfile.carbohydrates}{typeof productA.nutritionalProfile.carbohydrates === 'number' ? 'g' : ''}</span>
                  </div>
                  {productA.nutritionalProfile.betaGlucano && (
                    <div className="flex justify-between">
                      <span>β-Glucano:</span>
                      <span className="font-medium text-purple-600">{productA.nutritionalProfile.betaGlucano}{typeof productA.nutritionalProfile.betaGlucano === 'number' ? 'g' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Propuesta de Valor</h4>
                <p className="text-sm text-muted-foreground">{productA.valueProposition}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Características Clave</h4>
                <div className="space-y-1">
                  {productA.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Aplicaciones Comerciales</h4>
                <div className="flex flex-wrap gap-1">
                  {productA.commercial.applications.slice(0, 5).map((app, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Marco Regulatorio</h4>
                <div className="flex flex-wrap gap-1">
                  {productA.commercial.regulatoryFramework.map((reg, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {reg}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil Nutricional</CardTitle>
              <CardDescription>Visualización del perfil nutricional completo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={createRadarData(productA)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                  <Radar 
                    name={productA.name} 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Analysis */}
      {viewMode === 'single' && productA && marketAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análisis de Compatibilidad con Mercado Mexicano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Análisis por Categoría: {marketAnalysis.category}</h4>
                <div className="space-y-3">
                  {Object.entries(marketAnalysis.marketAlignment).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={
                        value === 'Excelente' || value === 'Diferenciador' || value === 'Alta aplicabilidad' ? 'default' :
                        value === 'Bueno' || value === 'Competitivo' || value === 'COFEPRIS compatible' ? 'secondary' : 'outline'
                      }>
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Score General
                  </h5>
                  <div className="flex items-center gap-2">
                    <Progress value={marketAnalysis.overallScore} className="flex-1" />
                    <span className="text-sm font-medium">{marketAnalysis.overallScore}/100</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  Oportunidades Identificadas
                </h4>
                <div className="space-y-2">
                  {marketAnalysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="h-3 w-3 text-green-500" />
                      {opportunity}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Estado Regulatorio</h5>
                  <div className="flex flex-wrap gap-1">
                    {marketAnalysis.regulatoryStatus.map((reg, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Aplicaciones Recomendadas</h5>
                  <div className="flex flex-wrap gap-1">
                    {marketAnalysis.recommendedApplications.slice(0, 4).map((app, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Comparison */}
      {viewMode === 'comparison' && productA && productB && comparison && (
        <div className="space-y-6">
          {/* Comparison Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Comparación: {productA.name} vs {productB.name}
              </CardTitle>
              <CardDescription>
                Análisis detallado de diferencias nutricionales y comerciales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {comparison.similarityScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Similitud Nutricional</div>
                  <Progress value={comparison.similarityScore} className="mt-2" />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Principales Diferencias</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Categorías:</span>
                      <span className="text-blue-600">{comparison.categoryA} vs {comparison.categoryB}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proteína:</span>
                      <span className={comparison.nutritionalDifferences.protein > 0 ? 'text-green-600' : 'text-red-600'}>
                        {comparison.nutritionalDifferences.protein > 0 ? '+' : ''}{comparison.nutritionalDifferences.protein.toFixed(1)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fibra:</span>
                      <span className={comparison.nutritionalDifferences.fiber > 0 ? 'text-green-600' : 'text-red-600'}>
                        {comparison.nutritionalDifferences.fiber > 0 ? '+' : ''}{comparison.nutritionalDifferences.fiber.toFixed(1)}g
                      </span>
                    </div>
                    {(comparison.productA.nutritionalProfile.betaGlucano || comparison.productB.nutritionalProfile.betaGlucano) && (
                      <div className="flex justify-between">
                        <span>β-Glucano:</span>
                        <span className={comparison.nutritionalDifferences.betaGlucano > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparison.nutritionalDifferences.betaGlucano > 0 ? '+' : ''}{comparison.nutritionalDifferences.betaGlucano.toFixed(1)}g
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recomendaciones</h4>
                  <div className="space-y-1">
                    {comparison.recommendations.map((rec, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side by Side Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Comparación Visual de Perfiles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={createCombinedRadarData(productA, productB)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                  <Radar 
                    name={productA.name} 
                    dataKey={productA.name} 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name={productB.name} 
                    dataKey={productB.name} 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}