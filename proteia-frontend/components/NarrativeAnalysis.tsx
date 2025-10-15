import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Eye, MessageSquare, Palette, Target, Lightbulb, Download } from 'lucide-react';

const visualTrends = [
  {
    category: 'Lácteos',
    palette: ['#2E7D4B', '#90C695', '#FFFFFF'],
    iconography: ['Hojas', 'Certificaciones Orgánicas', 'Origen Natural'],
    layout: 'Minimalista, fondo blanco, producto centrado',
    photography: 'Luz natural, ingredientes frescos, lifestyle'
  },
  {
    category: 'Bebidas Proteicas',
    palette: ['#FF6B35', '#F7931E', '#FFD23F'],
    iconography: ['Rayos de Energía', 'Músculos', 'Certificaciones Sport'],
    layout: 'Dinámico, gradientes, elementos gráficos bold',
    photography: 'Atletas, gimnasio, acción, post-workout'
  },
  {
    category: 'Snacks',
    palette: ['#8B4513', '#D2691E', '#F4A460'],
    iconography: ['Granos', 'Sin Gluten', 'Alto en Proteína'],
    layout: 'Texturizado, elementos naturales, pack destacado',
    photography: 'Ingredientes, texturas, momentos de consumo'
  }
];

const messagingTrends = [
  {
    category: 'Proteína Vegetal',
    claims: ['100% Plant-Based', 'Complete Protein', 'Sustainable Choice'],
    tone: 'Científico pero accesible',
    valueProps: ['Salud', 'Sostenibilidad', 'Performance'],
    frequency: 87,
    growth: '+34%'
  },
  {
    category: 'Funcional',
    claims: ['Alto en Proteína', 'Digestión Fácil', 'Sin Lactosa'],
    tone: 'Beneficio directo, confiable',
    valueProps: ['Digestibilidad', 'Conveniencia', 'Nutrición'],
    frequency: 76,
    growth: '+12%'
  },
  {
    category: 'Premium',
    claims: ['Ingredient Excellence', 'Crafted Quality', 'Pure Innovation'],
    tone: 'Aspiracional, premium',
    valueProps: ['Calidad', 'Innovación', 'Exclusividad'],
    frequency: 45,
    growth: '+28%'
  }
];

const recommendations = [
  {
    id: 1,
    title: 'Narrativa Visual Proteo50',
    description: 'Paleta científica con toques naturales',
    palette: ['#1E40AF', '#10B981', '#F3F4F6'],
    elements: 'Moléculas, hojas estilizadas, gradientes suaves',
    reasoning: 'Balance entre innovación científica y origen natural'
  },
  {
    id: 2,
    title: 'Mensajes Clave',
    description: 'Claims diferenciadores para México',
    claims: ['Proteína Completa 50g', 'Digestión Superior', 'Neutro en Sabor'],
    tone: 'Técnico pero comprensible',
    reasoning: 'Enfoque en beneficios funcionales únicos'
  },
  {
    id: 3,
    title: 'Estrategia de Posicionamiento',
    description: 'Ingredient branding premium',
    positioning: 'El ingrediente proteico que los innovadores eligen',
    channels: ['B2B Trade Shows', 'Digital Thought Leadership', 'Co-branding'],
    reasoning: 'Construir reconocimiento como líder tecnológico'
  }
];

export function NarrativeAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('visual');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Narrativas — Mercado México</CardTitle>
          <CardDescription>
            Tendencias visuales y de mensaje para posicionamiento estratégico
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visual">Narrativa Visual</TabsTrigger>
          <TabsTrigger value="messaging">Mensajes & Claims</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {visualTrends.map((trend, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {trend.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Palette */}
                  <div>
                    <h4 className="font-medium mb-2">Paleta Dominante</h4>
                    <div className="flex gap-1">
                      {trend.palette.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Iconography */}
                  <div>
                    <h4 className="font-medium mb-2">Iconografía</h4>
                    <div className="flex flex-wrap gap-1">
                      {trend.iconography.map((icon, iconIndex) => (
                        <Badge key={iconIndex} variant="outline" className="text-xs">
                          {icon}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Layout */}
                  <div>
                    <h4 className="font-medium mb-2">Layout</h4>
                    <p className="text-sm text-muted-foreground">{trend.layout}</p>
                  </div>

                  {/* Photography */}
                  <div>
                    <h4 className="font-medium mb-2">Fotografía</h4>
                    <p className="text-sm text-muted-foreground">{trend.photography}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sample Packages Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Galería de Referencias — Top Brands México
              </CardTitle>
              <CardDescription>
                Ejemplos de empaques exitosos por categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="aspect-square bg-muted rounded-lg flex items-center justify-center border">
                    <div className="text-center text-muted-foreground">
                      <div className="w-12 h-12 bg-muted-foreground/20 rounded mx-auto mb-2" />
                      <div className="text-sm">Producto {item}</div>
                      <div className="text-xs">Brand Name</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {messagingTrends.map((trend, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {trend.category}
                  </CardTitle>
                  <CardDescription>
                    Frecuencia: {trend.frequency}% • Crecimiento: {trend.growth}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Claims */}
                  <div>
                    <h4 className="font-medium mb-2">Claims Principales</h4>
                    <div className="space-y-1">
                      {trend.claims.map((claim, claimIndex) => (
                        <Badge key={claimIndex} variant="secondary" className="mr-1 mb-1">
                          {claim}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <h4 className="font-medium mb-2">Tono de Marca</h4>
                    <p className="text-sm text-muted-foreground">{trend.tone}</p>
                  </div>

                  {/* Value Props */}
                  <div>
                    <h4 className="font-medium mb-2">Value Props</h4>
                    <div className="space-y-1">
                      {trend.valueProps.map((prop, propIndex) => (
                        <div key={propIndex} className="text-sm">
                          • {prop}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Messaging Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Heatmap de Claims — Frecuencia en Mercado</CardTitle>
              <CardDescription>
                Análisis de frecuencia de claims por categoría (últimos 6 meses)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="font-medium">Claim</div>
                <div className="font-medium">Lácteos</div>
                <div className="font-medium">Bebidas</div>
                <div className="font-medium">Snacks</div>
                
                {[
                  ['Alto en Proteína', 89, 94, 76],
                  ['Plant-Based', 34, 67, 45],
                  ['Sin Lactosa', 78, 23, 12],
                  ['Orgánico', 45, 34, 67],
                  ['Sin Gluten', 23, 45, 89],
                  ['Complete Protein', 12, 78, 34]
                ].map(([claim, lacteos, bebidas, snacks], index) => (
                  <div key={index} className="contents">
                    <div className="py-2">{claim}</div>
                    <div className={`py-2 px-2 text-center rounded ${
                      lacteos > 70 ? 'bg-chart-1 text-white' : 
                      lacteos > 40 ? 'bg-chart-1/50' : 'bg-muted'
                    }`}>
                      {lacteos}%
                    </div>
                    <div className={`py-2 px-2 text-center rounded ${
                      bebidas > 70 ? 'bg-chart-2 text-white' : 
                      bebidas > 40 ? 'bg-chart-2/50' : 'bg-muted'
                    }`}>
                      {bebidas}%
                    </div>
                    <div className={`py-2 px-2 text-center rounded ${
                      snacks > 70 ? 'bg-chart-3 text-white' : 
                      snacks > 40 ? 'bg-chart-3/50' : 'bg-muted'
                    }`}>
                      {snacks}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    {rec.title}
                  </CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rec.palette && (
                    <div>
                      <h4 className="font-medium mb-2">Paleta Recomendada</h4>
                      <div className="flex gap-1 mb-2">
                        {rec.palette.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-8 h-8 rounded border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.elements}</p>
                    </div>
                  )}

                  {rec.claims && (
                    <div>
                      <h4 className="font-medium mb-2">Claims Sugeridos</h4>
                      <div className="space-y-1">
                        {rec.claims.map((claim, claimIndex) => (
                          <Badge key={claimIndex} variant="default" className="mr-1 mb-1">
                            {claim}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Tono: {rec.tone}</p>
                    </div>
                  )}

                  {rec.positioning && (
                    <div>
                      <h4 className="font-medium mb-2">Posicionamiento</h4>
                      <p className="text-sm mb-2 italic">"{rec.positioning}"</p>
                      <div className="text-sm">
                        <strong>Canales:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {rec.channels.map((channel, channelIndex) => (
                            <li key={channelIndex}>{channel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Rationale:</strong> {rec.reasoning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Implementation Toolkit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Toolkit de Implementación
              </CardTitle>
              <CardDescription>
                Materiales listos para pitch y desarrollo de materiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Brand Guidelines
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Mockup Templates
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Pitch Deck
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Asset Library
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Próximos Pasos Recomendados</h4>
                <ul className="text-sm space-y-1">
                  <li>• Desarrollar mockups de productos prioritarios con narrativa Proteo50</li>
                  <li>• Crear presentación ejecutiva para top 3 prospectos</li>
                  <li>• Definir materiales de trade marketing para eventos industria</li>
                  <li>• Establecer métricas de seguimiento para adoption narrative</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}