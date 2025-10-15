import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProductComparison } from './ProductComparison';
import { ClientProductComparison } from './ClientProductComparison';
import { NarrativeAnalysis } from './NarrativeAnalysis';
import { DetailedProductAnalysis } from './DetailedProductAnalysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FlaskConical, Package, PenTool, Microscope } from 'lucide-react';

export function CombinedProductComparison() {
  const [activeSubTab, setActiveSubTab] = useState('market-comparison');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Análisis Integral de Productos
          </CardTitle>
          <CardDescription>
            Comparación de mercado, análisis de portafolio de cliente y desarrollo de narrativas comerciales
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market-comparison" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Comparación Mercado
          </TabsTrigger>
          <TabsTrigger value="client-products" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Mis Productos
          </TabsTrigger>
          <TabsTrigger value="detailed-analysis" className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Análisis Detallado
          </TabsTrigger>
          <TabsTrigger value="narratives" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Narrativas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market-comparison" className="space-y-6 mt-6">
          <ProductComparison />
        </TabsContent>

        <TabsContent value="client-products" className="space-y-6 mt-6">
          <ClientProductComparison />
        </TabsContent>

        <TabsContent value="detailed-analysis" className="space-y-6 mt-6">
          <DetailedProductAnalysis />
        </TabsContent>

        <TabsContent value="narratives" className="space-y-6 mt-6">
          <NarrativeAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}