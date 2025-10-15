import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, TrendingUp, DollarSign, Users, ArrowRight, Star } from 'lucide-react';
import { mexicanBrands } from '../data/mexico-market-data';

const prospects = [
  {
    id: 1,
    company: 'GNC México',
    category: 'Suplementos y Proteínas',
    score: 96,
    priority: 'Muy Alta',
    playbook: 'Partnership Estratégico',
    products: mexicanBrands.find(b => b.name.includes('GNC'))?.productCount || 21,
    marketCap: 'Multinacional',
    timeline: '3-6 meses',
    revenue: '$850M MX',
    growth: 24.5,
    contact: 'Director de Producto - GNC México',
    reasoning: 'Líder en suplementos México, 21+ productos proteínicos, distribución nacional establecida'
  },
  {
    id: 2,
    company: 'Optimum Nutrition',
    category: 'Proteínas Premium',
    score: 94,
    priority: 'Muy Alta',
    playbook: 'Co-formulación',
    products: mexicanBrands.find(b => b.name === 'Optimum Nutrition')?.productCount || 25,
    marketCap: 'Multinacional',
    timeline: '6-9 meses',
    revenue: '$2.1B USD',
    growth: 18.7,
    contact: 'Innovation Manager - LATAM',
    reasoning: 'Marca #1 en proteínas México, 25 productos activos, enfoque en calidad premium'
  },
  {
    id: 3,
    company: 'Quest Nutrition',
    category: 'Snacks y Barras Proteicas',
    score: 91,
    priority: 'Muy Alta',
    playbook: 'Ingrediente Especializado',
    products: mexicanBrands.find(b => b.name === 'Quest')?.productCount || 15,
    marketCap: 'Grande',
    timeline: '4-8 meses',
    revenue: '$550M USD',
    growth: 22.3,
    contact: 'R&D Director - Quest',
    reasoning: '15 productos en México, liderazgo en snacks proteicos, enfoque innovación'
  },
  {
    id: 4,
    company: 'BSN (Glanbia)',
    category: 'Suplementos Deportivos',
    score: 87,
    priority: 'Alta',
    playbook: 'Sustitución Gradual',
    products: mexicanBrands.find(b => b.name === 'BSN')?.productCount || 3,
    marketCap: 'Multinacional',
    timeline: '6-12 meses',
    revenue: '$1.2B USD',
    growth: 15.2,
    contact: 'Supply Chain Director',
    reasoning: 'Productos premium establecidos, oportunidad reformulación con Proteo50'
  },
  {
    id: 5,
    company: 'Think! (Glanbia)',
    category: 'Barras Nutricionales',
    score: 84,
    priority: 'Alta',
    playbook: 'Marca Blanca Plus',
    products: mexicanBrands.find(b => b.name === 'Think!')?.productCount || 11,
    marketCap: 'Grande',
    timeline: '8-12 meses',
    revenue: '$380M USD',
    growth: 19.8,
    contact: 'Product Development Manager',
    reasoning: '11 productos México, enfoque health-conscious, márgenes atractivos'
  },
  {
    id: 6,
    company: 'ONE Brands',
    category: 'Barras de Proteína',
    score: 82,
    priority: 'Alta',
    playbook: 'Co-desarrollo',
    products: mexicanBrands.find(b => b.name === 'ONE')?.productCount || 7,
    marketCap: 'Mediana-Grande',
    timeline: '9-15 meses',
    revenue: '$250M USD',
    growth: 28.4,
    contact: 'Innovation Lead',
    reasoning: '7 productos activos, crecimiento acelerado, oportunidad expansión portfolio'
  },
  {
    id: 7,
    company: 'Alani Nu',
    category: 'Lifestyle Nutrition',
    score: 78,
    priority: 'Media-Alta',
    playbook: 'Partnership Premium',
    products: mexicanBrands.find(b => b.name === 'Alani Nu')?.productCount || 1,
    marketCap: 'Mediana',
    timeline: '12-18 meses',
    revenue: '$180M USD',
    growth: 45.2,
    contact: 'Business Development',
    reasoning: 'Marca emergente, alto crecimiento, oportunidad entrada temprana'
  }
];

const playbooks = [
  {
    name: 'Partnership Estratégico',
    description: 'Alianza integral con distribución y co-marketing',
    timeline: '3-9 meses',
    investment: 'Alto',
    risk: 'Medio'
  },
  {
    name: 'Co-formulación',
    description: 'Desarrollo conjunto productos específicos Proteo50',
    timeline: '6-18 meses',
    investment: 'Alto',
    risk: 'Medio-Alto'
  },
  {
    name: 'Ingrediente Especializado',
    description: 'Suministro B2B como ingrediente premium',
    timeline: '4-9 meses',
    investment: 'Bajo-Medio',
    risk: 'Bajo'
  },
  {
    name: 'Sustitución Gradual',
    description: 'Reemplazo progresivo proteínas actuales',
    timeline: '6-12 meses',
    investment: 'Medio',
    risk: 'Medio'
  },
  {
    name: 'Marca Blanca Plus',
    description: 'Manufactura privada con valor agregado',
    timeline: '8-12 meses',
    investment: 'Medio',
    risk: 'Medio'
  },
  {
    name: 'Co-desarrollo',
    description: 'Desarrollo conjunto líneas innovadoras',
    timeline: '9-15 meses',
    investment: 'Alto',
    risk: 'Alto'
  },
  {
    name: 'Partnership Premium',
    description: 'Alianza exclusiva segmento premium',
    timeline: '12-18 meses',
    investment: 'Alto',
    risk: 'Alto'
  }
];

export function ProspectRanking() {
  const [selectedPlaybook, setSelectedPlaybook] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredProspects = prospects.filter(prospect => {
    const playbookMatch = selectedPlaybook === 'all' || prospect.playbook === selectedPlaybook;
    const priorityMatch = selectedPriority === 'all' || prospect.priority === selectedPriority;
    return playbookMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Prospectos — Algoritmo de Priorización</CardTitle>
          <CardDescription>
            Empresas priorizadas según fit comercial, capacidad financiera y potencial de mercado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={selectedPlaybook} onValueChange={setSelectedPlaybook}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por Playbook" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Playbooks</SelectItem>
                <SelectItem value="Partnership Estratégico">Partnership Estratégico</SelectItem>
                <SelectItem value="Co-formulación">Co-formulación</SelectItem>
                <SelectItem value="Ingrediente Especializado">Ingrediente Especializado</SelectItem>
                <SelectItem value="Sustitución Gradual">Sustitución Gradual</SelectItem>
                <SelectItem value="Co-desarrollo">Co-desarrollo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Prioridades</SelectItem>
                <SelectItem value="Muy Alta">Muy Alta</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prospects List */}
          <div className="space-y-4">
            {filteredProspects.map((prospect, index) => (
              <Card key={prospect.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{prospect.company}</h3>
                          <Badge variant="outline">{prospect.category}</Badge>
                          <Badge 
                            variant={prospect.priority === 'Muy Alta' ? 'default' : 
                                   prospect.priority === 'Alta' ? 'secondary' : 'outline'}
                          >
                            {prospect.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{prospect.contact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-chart-1">{prospect.score}</div>
                      <div className="text-xs text-muted-foreground">Fit Score</div>
                    </div>
                  </div>

                  <Progress value={prospect.score} className="mb-4 h-2" />

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{prospect.revenue}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">+{prospect.growth}%</div>
                        <div className="text-xs text-muted-foreground">Crecimiento</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{prospect.products}</div>
                        <div className="text-xs text-muted-foreground">Productos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{prospect.timeline}</div>
                        <div className="text-xs text-muted-foreground">Timeline</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mr-2">
                        {prospect.playbook}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {prospect.reasoning}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Playbook Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Playbooks Comerciales — Referencia</CardTitle>
          <CardDescription>
            Estrategias de entrada y sus características
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playbooks.map((playbook) => (
              <div key={playbook.name} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-chart-1" />
                  <h4 className="font-medium">{playbook.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {playbook.description}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span className="font-medium">{playbook.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inversión:</span>
                    <span className="font-medium">{playbook.investment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Riesgo:</span>
                    <span className="font-medium">{playbook.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}