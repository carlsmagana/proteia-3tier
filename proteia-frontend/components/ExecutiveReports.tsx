import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { FileText, Download, Mail, Calendar, TrendingUp, Users, Target, AlertCircle, Settings } from 'lucide-react';
import { ReportExporter } from './ReportExporter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const executiveSummary = {
  totalOpportunities: 187,
  highPriorityProspects: 23,
  estimatedRevenue: '$12.3M',
  averageTimeToClose: '8.5 meses',
  topCategory: 'Lácteos',
  marketGrowth: '+18.7%',
  competitiveAdvantage: '92% similarity score promedio'
};

const weeklyMetrics = [
  { week: 'S1', prospects: 18, conversations: 12, demos: 3 },
  { week: 'S2', prospects: 22, conversations: 16, demos: 5 },
  { week: 'S3', prospects: 19, conversations: 14, demos: 4 },
  { week: 'S4', prospects: 25, conversations: 18, demos: 7 },
  { week: 'S5', prospects: 28, conversations: 21, demos: 8 },
  { week: 'S6', prospects: 31, conversations: 24, demos: 9 }
];

const pipelineData = [
  { stage: 'Identificación', count: 187, value: 45.2 },
  { stage: 'Calificación', count: 89, value: 28.7 },
  { stage: 'Contacto Inicial', count: 34, value: 15.8 },
  { stage: 'Propuesta', count: 12, value: 8.1 },
  { stage: 'Negociación', count: 5, value: 2.2 }
];

const keyAccounts = [
  {
    company: 'Grupo Lala',
    status: 'Negociación Avanzada',
    value: '$2.3M',
    probability: 85,
    nextAction: 'Demo técnico - 15 Oct',
    contact: 'Ana Martínez'
  },
  {
    company: 'Nestlé México',
    status: 'Propuesta Enviada',
    value: '$1.8M',
    probability: 70,
    nextAction: 'Follow-up comercial - 18 Oct',
    contact: 'Carlos Ruiz'
  },
  {
    company: 'Sigma Alimentos',
    status: 'Contacto Inicial',
    value: '$1.2M',
    probability: 45,
    nextAction: 'Reunión exploratoria - 22 Oct',
    contact: 'María González'
  }
];

const alerts = [
  {
    type: 'opportunity',
    message: 'Nuevo lanzamiento Danone con perfil proteico compatible (+94% similarity)',
    priority: 'high',
    date: '2024-10-12'
  },
  {
    type: 'competitive',
    message: 'Competidor directo anunció partnership con Grupo Bimbo',
    priority: 'high',
    date: '2024-10-11'
  },
  {
    type: 'market',
    message: 'Crecimiento categoría bebidas proteicas +34% vs Q3',
    priority: 'medium',
    date: '2024-10-10'
  }
];

const reports = [
  {
    id: 1,
    title: 'Reporte Semanal - Inteligencia Comercial',
    description: 'Resumen ejecutivo de oportunidades y métricas clave',
    type: 'weekly',
    lastGenerated: '2024-10-12',
    size: '2.3 MB'
  },
  {
    id: 2,
    title: 'Pipeline Prospects - Top 50 México',
    description: 'Análisis detallado de prospectos priorizados con contactos',
    type: 'prospects',
    lastGenerated: '2024-10-11',
    size: '1.8 MB'
  },
  {
    id: 3,
    title: 'Análisis Competitivo - Proteínas Alternativas',
    description: 'Landscape competitivo y positioning map',
    type: 'competitive',
    lastGenerated: '2024-10-09',
    size: '3.1 MB'
  },
  {
    id: 4,
    title: 'Narrativas & Messaging - Toolkit Comercial',
    description: 'Guías de mensaje, paletas y materiales de pitch',
    type: 'marketing',
    lastGenerated: '2024-10-08',
    size: '5.2 MB'
  }
];

export function ExecutiveReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedReport, setSelectedReport] = useState('all');
  const [showExporter, setShowExporter] = useState(false);

  const filteredReports = reports.filter(report => 
    selectedReport === 'all' || report.type === selectedReport
  );

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumen Ejecutivo — Dashboard Comercial
          </CardTitle>
          <CardDescription>
            Snapshot de performance y oportunidades clave (actualizado: {new Date().toLocaleDateString('es-MX')})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-chart-1">{executiveSummary.totalOpportunities}</div>
              <div className="text-sm text-muted-foreground">Oportunidades Totales</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-chart-2">{executiveSummary.highPriorityProspects}</div>
              <div className="text-sm text-muted-foreground">Prioridad Alta</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-chart-3">{executiveSummary.estimatedRevenue}</div>
              <div className="text-sm text-muted-foreground">Pipeline Estimado</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-chart-4">{executiveSummary.averageTimeToClose}</div>
              <div className="text-sm text-muted-foreground">Tiempo Promedio</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-medium">Categoría Líder</div>
              <div className="text-xl font-bold text-primary">{executiveSummary.topCategory}</div>
              <div className="text-sm text-muted-foreground">Mayor potencial de adopción</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Crecimiento Mercado</div>
              <div className="text-xl font-bold text-green-600">{executiveSummary.marketGrowth}</div>
              <div className="text-sm text-muted-foreground">Proteínas alternativas</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Ventaja Competitiva</div>
              <div className="text-xl font-bold text-blue-600">{executiveSummary.competitiveAdvantage}</div>
              <div className="text-sm text-muted-foreground">Fit nutricional</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Actividad
            </CardTitle>
            <CardDescription>
              Performance semanal de prospección (últimas 6 semanas)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="prospects" stroke="#8884d8" name="Prospectos" />
                <Line type="monotone" dataKey="conversations" stroke="#82ca9d" name="Conversaciones" />
                <Line type="monotone" dataKey="demos" stroke="#ffc658" name="Demos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline Comercial
            </CardTitle>
            <CardDescription>
              Distribución de oportunidades por etapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cuentas Clave — Status & Próximas Acciones
          </CardTitle>
          <CardDescription>
            Top prospects con mayor probabilidad de cierre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{account.company}</h4>
                    <Badge variant="outline">{account.status}</Badge>
                    <Badge variant="secondary">{account.probability}% prob.</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Contacto: {account.contact}</div>
                    <div>Próxima acción: {account.nextAction}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{account.value}</div>
                  <div className="text-sm text-muted-foreground">Pipeline value</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alertas & Notifications
          </CardTitle>
          <CardDescription>
            Señales importantes del mercado y competencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 border-l-4 ${
                alert.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'
              } rounded-r-lg`}>
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Biblioteca de Reportes
          </CardTitle>
          <CardDescription>
            Reportes ejecutivos y análisis detallados listos para descargar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los reportes</SelectItem>
                <SelectItem value="weekly">Reportes semanales</SelectItem>
                <SelectItem value="prospects">Análisis prospects</SelectItem>
                <SelectItem value="competitive">Análisis competitivo</SelectItem>
                <SelectItem value="marketing">Materiales marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowExporter(!showExporter)}>
              <Settings className="h-4 w-4 mr-2" />
              {showExporter ? 'Ocultar' : 'Mostrar'} Exportador
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Programar Envío
            </Button>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Generado: {report.lastGenerated}</span>
                    <span>Tamaño: {report.size}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Exporter */}
      {showExporter && (
        <div className="mt-6">
          <ReportExporter />
        </div>
      )}
    </div>
  );
}