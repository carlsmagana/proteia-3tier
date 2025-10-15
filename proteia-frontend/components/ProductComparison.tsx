import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Zap, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { mexicanProducts, proteo50Profile, calculateSimilarity } from '../data/mexico-market-data';
import { calculateAdvancedSimilarity, analyzeMarketOpportunity } from '../data/advanced-analytics';

// Calcular similitud para todos los productos usando algoritmo avanzado
const productsWithSimilarity = mexicanProducts.map(product => {
  const advanced = calculateAdvancedSimilarity(product);
  const opportunity = analyzeMarketOpportunity(product);
  return {
    ...product,
    similarity: advanced.similarityScore,
    advanced,
    opportunity
  };
});

// Función para generar perfil nutricional comparativo
const generateNutritionalProfile = (product: any) => [
  { metric: 'Proteína', proteo50: 95, producto: Math.min(100, (product.protein / 50) * 100) },
  { metric: 'Digestibilidad', proteo50: 92, producto: 85 },
  { metric: 'Aminoácidos', proteo50: 88, producto: Math.max(60, 100 - (product.addedSugars || 0) * 3) },
  { metric: 'Solubilidad', proteo50: 94, producto: Math.max(50, 100 - (product.sodium / 10)) },
  { metric: 'Neutralidad', proteo50: 90, producto: Math.max(40, 100 - (product.saturatedFat * 5)) },
  { metric: 'Funcionalidad', proteo50: 87, producto: Math.min(95, 50 + (product.dietaryFiber * 8)) }
];

export function ProductComparison() {
  const [selectedProduct, setSelectedProduct] = useState(productsWithSimilarity[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = productsWithSimilarity.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(mexicanProducts.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Comparador de Productos — Algoritmo Proteo50</CardTitle>
          <CardDescription>
            Analiza similitud nutricional y viabilidad comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto o marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Comparar
            </Button>
          </div>

          {/* Product Results */}
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProduct.id === product.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="outline">{product.brand}</Badge>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Proteína: {product.protein}g</span>
                      <span>Precio: ${product.price}</span>
                      <span>Energía: {product.energyContent} kcal</span>
                      {product.opportunity && <span>Revenue Est: ${product.opportunity.estimatedRevenue.toFixed(1)}M</span>}
                      {product.playbook && <span>Estrategia: {product.playbook}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.barriers && product.barriers.length > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-600">{product.barriers.length} barrier(s)</span>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-chart-1">{product.similarity}%</div>
                      <div className="text-xs text-muted-foreground">Similitud</div>
                    </div>
                  </div>
                </div>
                <Progress value={product.similarity} className="mt-3 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutritional Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil Nutricional — Radar de Comparación</CardTitle>
            <CardDescription>
              {selectedProduct.name} vs Proteo50 (scores normalizados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={generateNutritionalProfile(selectedProduct)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Proteo50"
                  dataKey="proteo50"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Producto"
                  dataKey="producto"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Viabilidad</CardTitle>
            <CardDescription>
              Resultado del algoritmo de priorización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Score de Similitud</div>
                  <div className="text-sm text-muted-foreground">
                    Perfil nutricional compatible
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {selectedProduct.similarity}%
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`h-5 w-5 rounded-full ${
                  !selectedProduct.barriers || selectedProduct.barriers.length === 0 ? 'bg-green-500' : 
                  selectedProduct.barriers.length <= 2 ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-medium">Barreras Identificadas</div>
                  <div className="text-sm text-muted-foreground">
                    {!selectedProduct.barriers || selectedProduct.barriers.length === 0 ? 'Sin barreras críticas' : 
                     `${selectedProduct.barriers.length} barreras: ${selectedProduct.barriers.join(', ')}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Playbook Recomendado</div>
                  <div className="text-sm text-muted-foreground">
                    Estrategia de entrada sugerida
                  </div>
                </div>
              </div>
              <Badge variant="default">{selectedProduct.playbook || 'Por definir'}</Badge>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Oportunidad Comercial</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Este producto presenta {selectedProduct.similarity > 85 ? 'alta' : selectedProduct.similarity > 75 ? 'media' : 'baja'} compatibilidad 
                con Proteo50. {selectedProduct.opportunity?.recommendedStrategy ? `Se recomienda ${selectedProduct.opportunity.recommendedStrategy.toLowerCase()} como estrategia 
                de entrada` : 'Requiere análisis adicional para definir estrategia'} con timeline de {selectedProduct.opportunity?.timeline || '6-12 meses'}.
              </p>
              {selectedProduct.opportunity && (
                <div className="grid grid-cols-3 gap-4 text-sm border-t pt-3">
                  <div>
                    <div className="font-medium">Revenue Estimado</div>
                    <div className="text-green-600">${selectedProduct.opportunity.estimatedRevenue.toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="font-medium">Prob. Éxito</div>
                    <div className="text-blue-600">{selectedProduct.opportunity.successProbability}%</div>
                  </div>
                  <div>
                    <div className="font-medium">Inversión</div>
                    <div className="text-amber-600">{selectedProduct.opportunity.investmentRequired}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}