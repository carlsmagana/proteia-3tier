import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { mexicanProducts } from '../data/mexico-market-data';
import { calculateAdvancedSimilarity, analyzeMarketOpportunity } from '../data/advanced-analytics';
import { clientProducts, getPortfolioMetrics } from '../data/client-products';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdate: string;
}

interface AlertItem {
  id: string;
  type: 'opportunity' | 'risk' | 'system' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export function RealTimeDashboard() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  // Simular conexión en tiempo real
  useEffect(() => {
    const generateMetrics = (): RealTimeMetric[] => {
      const productsWithAnalytics = mexicanProducts.map(p => ({
        ...p,
        analytics: calculateAdvancedSimilarity(p),
        opportunity: analyzeMarketOpportunity(p)
      }));

      const portfolioMetrics = getPortfolioMetrics();
      const highSimilarity = productsWithAnalytics.filter(p => p.analytics.similarityScore > 85).length;
      const topOpportunities = productsWithAnalytics.filter(p => p.opportunity.opportunityScore > 80).length;
      const avgSimilarity = productsWithAnalytics.reduce((sum, p) => sum + p.analytics.similarityScore, 0) / productsWithAnalytics.length;
      const totalRevenuePotential = productsWithAnalytics.reduce((sum, p) => sum + p.opportunity.estimatedRevenue, 0);

      return [
        {
          id: 'high-similarity',
          name: 'Productos Alta Similitud',
          value: highSimilarity,
          change: Math.random() > 0.5 ? 1 : -1,
          trend: Math.random() > 0.3 ? 'up' : 'stable',
          status: highSimilarity > 8 ? 'excellent' : 'good',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'top-opportunities',
          name: 'Top Oportunidades',
          value: topOpportunities,
          change: Math.floor(Math.random() * 3),
          trend: 'up',
          status: topOpportunities > 6 ? 'excellent' : 'good',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'avg-similarity',
          name: 'Similitud Promedio',
          value: Math.round(avgSimilarity),
          change: Math.random() * 4 - 2,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          status: avgSimilarity > 85 ? 'excellent' : avgSimilarity > 75 ? 'good' : 'warning',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'revenue-potential',
          name: 'Revenue Potential (M)',
          value: Math.round(totalRevenuePotential * 10) / 10,
          change: Math.random() * 2,
          trend: 'up',
          status: totalRevenuePotential > 15 ? 'excellent' : 'good',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'client-products',
          name: 'Productos Cliente',
          value: portfolioMetrics.totalProducts,
          change: portfolioMetrics.developmentPipeline > 0 ? 1 : 0,
          trend: portfolioMetrics.developmentPipeline > 0 ? 'up' : 'stable',
          status: portfolioMetrics.totalProducts > 3 ? 'excellent' : portfolioMetrics.totalProducts > 1 ? 'good' : 'warning',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'avg-protein',
          name: 'Proteína Promedio (%)',
          value: Math.round(portfolioMetrics.nutritionalAverages.protein),
          change: Math.random() * 2 - 1,
          trend: Math.random() > 0.5 ? 'up' : 'stable',
          status: portfolioMetrics.nutritionalAverages.protein > 40 ? 'excellent' : 'good',
          lastUpdate: new Date().toISOString()
        }
      ];
    };

    const generateAlerts = (): AlertItem[] => {
      const alertTemplates = [
        {
          type: 'opportunity' as const,
          severity: 'high' as const,
          message: 'Nuevo producto con 94% similarity detectado en categoría Bebidas Proteicas'
        },
        {
          type: 'market' as const,
          severity: 'medium' as const,
          message: 'Incremento del 12% en menciones de proteína alternativa esta semana'
        },
        {
          type: 'opportunity' as const,
          severity: 'medium' as const,
          message: 'Proteo50 muestra 96% compatibilidad con productos premium GNC'
        },
        {
          type: 'system' as const,
          severity: 'low' as const,
          message: 'Perfil nutricional de productos cliente actualizado'
        },
        {
          type: 'risk' as const,
          severity: 'low' as const,
          message: 'Competidor anunció nuevo producto en categoría Snacks Proteicos'
        },
        {
          type: 'system' as const,
          severity: 'low' as const,
          message: 'Algoritmo de similitud actualizado a versión 2.1.4'
        }
      ];

      return alertTemplates.map((template, index) => ({
        id: `alert-${index}`,
        ...template,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        acknowledged: Math.random() > 0.7
      }));
    };

    const generateActivityData = () => {
      const now = new Date();
      return Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        return {
          time: hour.getHours().toString().padStart(2, '0') + ':00',
          prospects: Math.floor(Math.random() * 10) + 5,
          analyses: Math.floor(Math.random() * 15) + 8,
          alerts: Math.floor(Math.random() * 3),
          timestamp: hour.getTime()
        };
      });
    };

    // Inicializar datos
    setMetrics(generateMetrics());
    setAlerts(generateAlerts());
    setActivityData(generateActivityData());

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setMetrics(generateMetrics());
      
      // Ocasionalmente agregar nuevas alertas
      if (Math.random() > 0.8) {
        const newAlert: AlertItem = {
          id: `alert-${Date.now()}`,
          type: ['opportunity', 'market', 'risk', 'system'][Math.floor(Math.random() * 4)] as any,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          message: 'Nueva actividad detectada en el sistema',
          timestamp: new Date().toISOString(),
          acknowledged: false
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }

      // Simular pérdida ocasional de conexión
      if (Math.random() > 0.95) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Force refresh of data
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Dashboard en Tiempo Real
              </CardTitle>
              <CardDescription>
                Monitoreo continuo de métricas y oportunidades
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map(metric => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{metric.name}</div>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  {metric.trend === 'stable' && <div className="h-3 w-3 rounded-full bg-gray-400" />}
                </div>
              </div>
              
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={`flex items-center gap-1 ${
                  metric.change > 0 ? 'text-green-600' : 
                  metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </span>
                <Badge 
                  variant={
                    metric.status === 'excellent' ? 'default' :
                    metric.status === 'good' ? 'secondary' :
                    metric.status === 'warning' ? 'outline' : 'destructive'
                  }
                  className="text-xs"
                >
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Últimas 24h</CardTitle>
            <CardDescription>
              Análisis de productos, prospectos y alertas por hora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="prospects" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Prospectos"
                />
                <Area 
                  type="monotone" 
                  dataKey="analyses" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                  name="Análisis"
                />
                <Area 
                  type="monotone" 
                  dataKey="alerts" 
                  stackId="1"
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.6}
                  name="Alertas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Alertas en Tiempo Real
                  {unacknowledgedAlerts.length > 0 && (
                    <Badge variant="destructive">{unacknowledgedAlerts.length}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Notificaciones automáticas del sistema
                </CardDescription>
              </div>
              {criticalAlerts.length > 0 && (
                <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {alerts.slice(0, 10).map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 border-l-4 rounded-r-lg ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  } ${alert.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {alert.type}
                        </Badge>
                        <Badge 
                          variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'outline' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiempo de respuesta</span>
                  <span className="text-green-600">0.23s</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Throughput</span>
                  <span className="text-green-600">94.7%</span>
                </div>
                <Progress value={94.7} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Datos</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calidad de datos</span>
                  <span className="text-green-600">96.2%</span>
                </div>
                <Progress value={96.2} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Última sincronización</span>
                  <span className="text-green-600">2min ago</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Algoritmo</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Precisión</span>
                  <span className="text-green-600">89.3%</span>
                </div>
                <Progress value={89.3} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Confianza</span>
                  <span className="text-green-600">91.7%</span>
                </div>
                <Progress value={91.7} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}