import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Mail, 
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mexicanProducts } from '../data/mexico-market-data';
import { calculateAdvancedSimilarity, analyzeMarketOpportunity } from '../data/advanced-analytics';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'png' | 'json';
  sections: string[];
  includeCharts: boolean;
  includeData: boolean;
  includeAnalytics: boolean;
  timeRange: 'current' | 'monthly' | 'quarterly';
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: string;
  recipients: string[];
  lastSent: string;
  nextSend: string;
  status: 'active' | 'paused';
}

const defaultExportOptions: ExportOptions = {
  format: 'pdf',
  sections: ['executive-summary', 'market-overview', 'product-analysis'],
  includeCharts: true,
  includeData: true,
  includeAnalytics: true,
  timeRange: 'current'
};

const availableSections = [
  { id: 'executive-summary', name: 'Resumen Ejecutivo', description: 'KPIs y métricas clave' },
  { id: 'market-overview', name: 'Overview del Mercado', description: 'Análisis de categorías y tendencias' },
  { id: 'product-analysis', name: 'Análisis de Productos', description: 'Comparaciones y similarity scores' },
  { id: 'prospect-ranking', name: 'Ranking de Prospectos', description: 'Lista priorizada con playbooks' },
  { id: 'predictive-analytics', name: 'Analytics Predictivos', description: 'Forecasts y recomendaciones AI' },
  { id: 'narrative-insights', name: 'Insights de Narrativa', description: 'Tendencias visuales y messaging' },
  { id: 'competitive-analysis', name: 'Análisis Competitivo', description: 'Landscape y positioning' }
];

const scheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Reporte Semanal - Directivos',
    frequency: 'weekly',
    format: 'PDF',
    recipients: ['ceo@proteo50.com', 'cmo@proteo50.com'],
    lastSent: '2024-10-07',
    nextSend: '2024-10-14',
    status: 'active'
  },
  {
    id: '2',
    name: 'Análisis Mensual - Equipos',
    frequency: 'monthly',
    format: 'Excel',
    recipients: ['sales@proteo50.com', 'rd@proteo50.com'],
    lastSent: '2024-10-01',
    nextSend: '2024-11-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'Dashboard Diario - Analytics',
    frequency: 'daily',
    format: 'PNG',
    recipients: ['analytics@proteo50.com'],
    lastSent: '2024-10-12',
    nextSend: '2024-10-13',
    status: 'paused'
  }
];

export function ReportExporter() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(defaultExportOptions);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'quick' | 'custom' | 'scheduled'>('quick');

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simular proceso de exportación
    const steps = [
      'Recopilando datos...',
      'Generando análisis...',
      'Creando visualizaciones...',
      'Compilando reporte...',
      'Finalizando exportación...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExportProgress((i + 1) * 20);
    }

    // Simular descarga
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsExporting(false);
    setExportProgress(100);

    // Aquí iría la lógica real de generación y descarga
    console.log('Exportando reporte con opciones:', exportOptions);
  };

  const handleSectionToggle = (sectionId: string) => {
    setExportOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(s => s !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  // Datos para preview del reporte
  const reportStats = {
    totalProducts: mexicanProducts.length,
    highSimilarity: mexicanProducts.filter(p => {
      const analytics = calculateAdvancedSimilarity(p);
      return analytics.similarityScore > 85;
    }).length,
    topOpportunities: mexicanProducts.filter(p => {
      const opportunity = analyzeMarketOpportunity(p);
      return opportunity.opportunityScore > 80;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportador de Reportes — Inteligencia Comercial
          </CardTitle>
          <CardDescription>
            Genera reportes personalizados en múltiples formatos para stakeholders
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Export */}
      {activeTab === 'quick' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Exportación Rápida</CardTitle>
              <CardDescription>
                Reportes pre-configurados listos para descargar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <FileText className="h-6 w-6" />
                  Reporte Ejecutivo PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  Datos Completos Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <FileImage className="h-6 w-6" />
                  Dashboard PNG
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <Mail className="h-6 w-6" />
                  Enviar por Email
                </Button>
              </div>

              {isExporting && (
                <div className="mt-6 p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Generando reporte...</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {exportProgress}% completado
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-chart-1">{reportStats.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Productos Analizados</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-chart-2">{reportStats.highSimilarity}</div>
                <div className="text-sm text-muted-foreground">Alta Similitud (&gt;85%)</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-chart-3">{reportStats.topOpportunities}</div>
                <div className="text-sm text-muted-foreground">Top Oportunidades</div>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="font-medium">Incluirá:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Análisis de similitud avanzado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ranking de oportunidades</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Visualizaciones interactivas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Recomendaciones de estrategia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Export */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Personalizada</CardTitle>
              <CardDescription>
                Personaliza el contenido y formato de tu reporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div>
                <h4 className="font-medium mb-3">Formato de Exportación</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'pdf', icon: FileText, label: 'PDF' },
                    { value: 'excel', icon: FileSpreadsheet, label: 'Excel' },
                    { value: 'png', icon: FileImage, label: 'PNG' },
                    { value: 'json', icon: FileText, label: 'JSON' }
                  ].map(format => (
                    <Button
                      key={format.value}
                      variant={exportOptions.format === format.value ? 'default' : 'outline'}
                      className="h-16 flex-col gap-1"
                      onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                    >
                      <format.icon className="h-5 w-5" />
                      {format.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sections Selection */}
              <div>
                <h4 className="font-medium mb-3">Secciones a Incluir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSections.map(section => (
                    <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={section.id}
                        checked={exportOptions.sections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={section.id} className="text-sm font-medium cursor-pointer">
                          {section.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Options */}
              <div>
                <h4 className="font-medium mb-3">Opciones Adicionales</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="charts"
                      checked={exportOptions.includeCharts}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                      }
                    />
                    <label htmlFor="charts" className="text-sm">Incluir gráficos y visualizaciones</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="data"
                      checked={exportOptions.includeData}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeData: !!checked }))
                      }
                    />
                    <label htmlFor="data" className="text-sm">Incluir tablas de datos raw</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="analytics"
                      checked={exportOptions.includeAnalytics}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeAnalytics: !!checked }))
                      }
                    />
                    <label htmlFor="analytics" className="text-sm">Incluir análisis predictivo</label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Time Range */}
              <div>
                <h4 className="font-medium mb-3">Rango de Tiempo</h4>
                <Select 
                  value={exportOptions.timeRange} 
                  onValueChange={(value) => 
                    setExportOptions(prev => ({ ...prev, timeRange: value as any }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Datos actuales</SelectItem>
                    <SelectItem value="monthly">Últimos 30 días</SelectItem>
                    <SelectItem value="quarterly">Último trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleExport} disabled={isExporting || exportOptions.sections.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scheduled Reports */}
      {activeTab === 'scheduled' && (
        <Card>
          <CardHeader>
            <CardTitle>Reportes Programados</CardTitle>
            <CardDescription>
              Automatiza la generación y envío de reportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">{report.frequency}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Formato: {report.format}</span>
                      <span className="mx-2">•</span>
                      <span>Destinatarios: {report.recipients.length}</span>
                      <span className="mx-2">•</span>
                      <span>Último envío: {report.lastSent}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Ahora
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Nuevo Reporte Programado
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg shadow-lg p-2">
        <div className="flex gap-1">
          {[
            { value: 'quick', label: 'Rápido', icon: Download },
            { value: 'custom', label: 'Personalizado', icon: Settings },
            { value: 'scheduled', label: 'Programado', icon: Calendar }
          ].map(tab => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.value as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}