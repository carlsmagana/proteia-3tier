import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';
import { mexicanProducts } from '../data/mexico-market-data';
import { 
  calculateAdvancedSimilarity, 
  analyzeMarketOpportunity, 
  generatePredictiveInsights,
  generateAutoRecommendations,
  getAlgorithmPerformance
} from '../data/advanced-analytics';

export function AdvancedAnalytics() {
  // Calcular analytics avanzados para todos los productos
  const productsWithAdvancedAnalytics = mexicanProducts.map(product => ({
    ...product,
    advanced: calculateAdvancedSimilarity(product),
    opportunity: analyzeMarketOpportunity(product)
  }));

  const [selectedProduct, setSelectedProduct] = useState(productsWithAdvancedAnalytics[0]);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [activeTab, setActiveTab] = useState('insights');

  // Generar recomendaciones automáticas
  const autoRecommendations = generateAutoRecommendations();

  // Performance del algoritmo
  const algorithmPerformance = getAlgorithmPerformance();

  // Insights predictivos para categoría seleccionada
  const predictiveInsights = generatePredictiveInsights(selectedProduct.category);

  // Preparar datos para visualizaciones
  const radarData = [
    { 
      metric: 'Similarity', 
      value: selectedProduct.advanced?.similarityScore || 0,
      benchmark: 85
    },
    { 
      metric: 'Market Fit', 
      value: selectedProduct.advanced?.marketFit || 0,
      benchmark: 80
    },
    { 
      metric: 'Revenue Pot.', 
      value: selectedProduct.advanced?.revenuePotential || 0,
      benchmark: 70
    },
    { 
      metric: 'Competitive Adv.', 
      value: selectedProduct.advanced?.competitiveAdvantage || 0,
      benchmark: 75
    },
    { 
      metric: 'Risk Score', 
      value: selectedProduct.advanced?.riskScore || 0,
      benchmark: 65
    }
  ];

  // Scatter plot data para risk vs opportunity
  const riskOpportunityData = productsWithAdvancedAnalytics.map(product => ({
    x: product.advanced.riskScore,
    y: product.opportunity.opportunityScore,
    name: product.name,
    category: product.category,
    revenue: product.opportunity.estimatedRevenue
  }));

  // Top opportunities
  const topOpportunities = productsWithAdvancedAnalytics
    .sort((a, b) => b.opportunity.opportunityScore - a.opportunity.opportunityScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis Predictivo Avanzado — Proteo50 Intelligence
          </CardTitle>
          <CardDescription>
            Algoritmos de machine learning para optimización de oportunidades comerciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-chart-1">{algorithmPerformance.accuracyRate}%</div>
              <div className="text-sm text-muted-foreground">Precisión Algoritmo</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-chart-2">{algorithmPerformance.processingTime}s</div>
              <div className="text-sm text-muted-foreground">Tiempo Proceso</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-chart-3">{algorithmPerformance.dataQuality}%</div>
              <div className="text-sm text-muted-foreground">Calidad Datos</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-chart-4">v{algorithmPerformance.modelVersion}</div>
              <div className="text-sm text-muted-foreground">Versión Modelo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="deep-analysis">Análisis Profundo</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
          <TabsTrigger value="optimization">Optimización</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Auto Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recomendaciones Automáticas — AI Generated
              </CardTitle>
              <CardDescription>
                Insights generados automáticamente por análisis de patrones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {autoRecommendations.map((rec, index) => (
                  <div key={index} className={`p-4 border-l-4 rounded-r-lg ${
                    rec.type === 'opportunity' ? 'border-green-500 bg-green-50' :
                    rec.type === 'risk' ? 'border-red-500 bg-red-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {rec.type === 'opportunity' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {rec.type === 'risk' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {rec.type === 'optimization' && <Target className="h-5 w-5 text-blue-600" />}
                        <h4 className="font-medium">{rec.title}</h4>
                      </div>
                      <Badge variant={rec.priority === 'high' ? 'default' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="text-sm">
                      <strong>Acción recomendada:</strong> {rec.action}
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      <strong>Impacto esperado:</strong> {rec.impact}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Opportunities Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Oportunidades — Score Multidimensional</CardTitle>
              <CardDescription>
                Ranking basado en algoritmo de scoring avanzado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topOpportunities.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium">{product.name}</span>
                          <Badge variant="outline">{product.brand}</Badge>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <span>Revenue Est: ${product.opportunity.estimatedRevenue.toFixed(1)}M</span>
                          <span>Success Prob: {product.opportunity.successProbability}%</span>
                          <span>Timeline: {product.opportunity.timeline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-chart-1">{product.opportunity.opportunityScore}</div>
                      <div className="text-xs text-muted-foreground">Opp. Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deep-analysis" className="space-y-6">
          {/* Product Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Producto</CardTitle>
              <CardDescription>
                Selecciona un producto para análisis multidimensional profundo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedProduct.id.toString()} 
                onValueChange={(value) => setSelectedProduct(productsWithAdvancedAnalytics.find(p => p.id.toString() === value) || productsWithAdvancedAnalytics[0])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {productsWithAdvancedAnalytics.map(product => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - {product.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advanced Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Perfil Multidimensional — Radar Avanzado</CardTitle>
                <CardDescription>
                  Análisis vs benchmarks de industria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Producto"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Benchmark"
                      dataKey="benchmark"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Metrics Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Clave — Desglose Detallado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Similarity Score</span>
                      <span className="font-medium">{selectedProduct.advanced?.similarityScore}%</span>
                    </div>
                    <Progress value={selectedProduct.advanced?.similarityScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Fit</span>
                      <span className="font-medium">{selectedProduct.advanced?.marketFit}%</span>
                    </div>
                    <Progress value={selectedProduct.advanced?.marketFit} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Potential</span>
                      <span className="font-medium">{selectedProduct.advanced?.revenuePotential}%</span>
                    </div>
                    <Progress value={selectedProduct.advanced?.revenuePotential} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Competitive Advantage</span>
                      <span className="font-medium">{selectedProduct.advanced?.competitiveAdvantage}%</span>
                    </div>
                    <Progress value={selectedProduct.advanced?.competitiveAdvantage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Score</span>
                      <span className="font-medium">{selectedProduct.advanced?.riskScore}%</span>
                    </div>
                    <Progress value={selectedProduct.advanced?.riskScore} className="h-2" />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Estrategia Recomendada</div>
                    <Badge variant="secondary" className="mt-1">
                      {selectedProduct.opportunity?.recommendedStrategy}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">Timeline</div>
                    <div className="text-muted-foreground">{selectedProduct.opportunity?.timeline}</div>
                  </div>
                  <div>
                    <div className="font-medium">Inversión Requerida</div>
                    <div className="text-muted-foreground">{selectedProduct.opportunity?.investmentRequired}</div>
                  </div>
                  <div>
                    <div className="font-medium">Prob. Éxito</div>
                    <div className="text-green-600 font-medium">{selectedProduct.opportunity?.successProbability}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Market Trend Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predicciones de Mercado — {selectedProduct.category}
              </CardTitle>
              <CardDescription>
                Forecasting basado en análisis de patrones históricos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Demanda Proyectada (6 meses)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={predictiveInsights.demandForecast.map((value, index) => ({
                      month: `M${index + 1}`,
                      demand: value,
                      trend: value * 1.1 // Trend line
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="demand" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="trend" stroke="#82ca9d" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Estacionalidad (12 meses)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={predictiveInsights.seasonality.map((value, index) => ({
                      month: `${index + 1}`,
                      seasonality: value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="seasonality" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">{predictiveInsights.trendStrength}%</div>
                  <div className="text-sm text-muted-foreground">Fuerza de Tendencia</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-amber-600">{predictiveInsights.competitivePressure}%</div>
                  <div className="text-sm text-muted-foreground">Presión Competitiva</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{predictiveInsights.priceElasticity}</div>
                  <div className="text-sm text-muted-foreground">Elasticidad Precio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Risk vs Opportunity Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Matriz Riesgo vs Oportunidad — Portfolio Optimization</CardTitle>
              <CardDescription>
                Bubble chart para identificar sweet spots del portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskOpportunityData}>
                  <CartesianGrid />
                  <XAxis 
                    dataKey="x" 
                    name="Risk Score" 
                    domain={[20, 100]}
                    label={{ value: 'Risk Score', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Opportunity Score" 
                    domain={[40, 100]}
                    label={{ value: 'Opportunity Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.category}</p>
                            <p className="text-sm">Risk: {data.x}% | Opportunity: {data.y}%</p>
                            <p className="text-sm">Revenue Est: ${data.revenue.toFixed(1)}M</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="y" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">High Opp + Low Risk</div>
                  <div className="text-green-600">Sweet Spot</div>
                </div>
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="font-medium text-yellow-800">High Opp + High Risk</div>
                  <div className="text-yellow-600">High Reward</div>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800">Low Opp + Low Risk</div>
                  <div className="text-blue-600">Stable Entry</div>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Low Opp + High Risk</div>
                  <div className="text-red-600">Avoid</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Acciones de Optimización Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Activity className="h-6 w-6" />
                  Re-evaluar Portfolio
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Target className="h-6 w-6" />
                  Optimizar Targeting
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Ajustar Algoritmo
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <PieChart className="h-6 w-6" />
                  Rebalancear Pesos
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Update Forecasts
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Brain className="h-6 w-6" />
                  Retrain Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}