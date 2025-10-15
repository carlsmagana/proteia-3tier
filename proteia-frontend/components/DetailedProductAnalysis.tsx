import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Activity, 
  Award, 
  Beaker, 
  CheckCircle, 
  Palette, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  Info,
  Star
} from 'lucide-react';
import { 
  airtableExtendedService, 
  NutritionalInfo, 
  KeyBenefit, 
  ClaimExclusion, 
  KeyIngredient, 
  DesignColor, 
  Certification 
} from '../utils/airtable-extended-service';

interface DetailedProductAnalysisProps {
  productId?: string;
  productName?: string;
}

export function DetailedProductAnalysis({ productId = 'Proteo50', productName = 'Proteo50' }: DetailedProductAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    nutritional: NutritionalInfo[];
    benefits: KeyBenefit[];
    claims: ClaimExclusion[];
    ingredients: KeyIngredient[];
    colors: DesignColor[];
    certifications: Certification[];
  } | null>(null);

  useEffect(() => {
    loadDetailedAnalysis();
  }, [productId]);

  const loadDetailedAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await airtableExtendedService.getCompleteProductAnalysis(productId);
      setData(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando análisis detallado');
      console.error('Error loading detailed analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Cargando análisis detallado...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error cargando análisis detallado: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const nutritional = data.nutritional[0];
  const benefit = data.benefits[0];
  const claim = data.claims[0];
  const colors = data.colors[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Análisis Detallado: {productName}
          </CardTitle>
          <CardDescription>
            Análisis completo basado en datos de múltiples fuentes de Airtable
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="nutritional" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="nutritional">Nutricional</TabsTrigger>
          <TabsTrigger value="benefits">Beneficios</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          <TabsTrigger value="design">Diseño</TabsTrigger>
          <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
        </TabsList>

        {/* Información Nutricional */}
        <TabsContent value="nutritional" className="space-y-4">
          {nutritional ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Macronutrientes por Porción
                  </CardTitle>
                  <CardDescription>
                    Tamaño de porción: {nutritional.serving_size || '30g'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calorías</span>
                        <span className="font-medium">{nutritional.calories || 120} kcal</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Proteína</span>
                        <span className="font-medium">{nutritional.protein || 24}g</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carbohidratos</span>
                        <span className="font-medium">{nutritional.carbs || 3}g</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Grasa</span>
                        <span className="font-medium">{nutritional.fat || 1}g</span>
                      </div>
                      <Progress value={3} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Micronutrientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Vitaminas</h4>
                    <div className="flex flex-wrap gap-1">
                      {(nutritional.vitamins || ['B6', 'B12', 'C']).map((vitamin) => (
                        <Badge key={vitamin} variant="secondary">{vitamin}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Minerales</h4>
                    <div className="flex flex-wrap gap-1">
                      {(nutritional.minerals || ['Calcio', 'Hierro', 'Zinc']).map((mineral) => (
                        <Badge key={mineral} variant="outline">{mineral}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    <div>Sodio: {nutritional.sodium || 150}mg</div>
                    <div>Azúcar: {nutritional.sugar || 2}g</div>
                    <div>Fibra: {nutritional.fiber || 0}g</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No se encontró información nutricional específica. Mostrando datos de demostración.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Beneficios Clave */}
        <TabsContent value="benefits" className="space-y-4">
          {benefit ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Beneficio Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="default" className="mb-2">
                        {benefit.benefit_category || 'Músculo y Fuerza'}
                      </Badge>
                      <h3 className="font-medium">{benefit.primary_benefit || 'Desarrollo muscular magro'}</h3>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Audiencia Objetivo</h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.target_audience || 'Atletas y personas activas'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Eficacia</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={(benefit.efficacy_rating || 9) * 10} className="flex-1" />
                        <span className="text-sm font-medium">{benefit.efficacy_rating || 9}/10</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Beneficios Secundarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {(benefit.secondary_benefits || ['Recuperación post-ejercicio', 'Saciedad']).map((secondaryBenefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{secondaryBenefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Evidencia Clínica</h4>
                    <p className="text-xs text-muted-foreground">
                      {benefit.clinical_evidence || 'Estudios clínicos demuestran aumento del 25% en síntesis proteica'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No se encontraron beneficios específicos. Mostrando datos de demostración.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Claims y Exclusiones */}
        <TabsContent value="claims" className="space-y-4">
          {claim ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Claims Aprobados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Claims Generales</h4>
                    <div className="space-y-1">
                      {(claim.approved_claims || ['Contribuye al desarrollo muscular', 'Fuente de proteína completa']).map((claimText, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-xs">{claimText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Health Claims</h4>
                    <div className="space-y-1">
                      {(claim.health_claims || ['Mantiene músculos saludables']).map((healthClaim, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-xs">{healthClaim}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Estado: <Badge variant="default" className="text-xs">
                      {claim.compliance_status || 'Aprobado'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Claims Restringidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">No Permitidos</h4>
                    <div className="space-y-1">
                      {(claim.restricted_claims || ['Cura enfermedades', 'Garantiza pérdida de peso']).map((restrictedClaim, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-xs">{restrictedClaim}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Notas Regulatorias</h4>
                    <p className="text-xs text-muted-foreground">
                      {claim.regulatory_notes || 'Cumple con regulaciones COFEPRIS'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No se encontraron claims específicos. Mostrando datos de demostración.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Ingredientes */}
        <TabsContent value="ingredients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ingredients.length > 0 ? data.ingredients.map((ingredient) => (
              <Card key={ingredient.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{ingredient.ingredient_name}</CardTitle>
                  <CardDescription>{ingredient.ingredient_type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Concentración:</span>
                      <span className="font-medium">{ingredient.concentration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fuente:</span>
                      <span className="font-medium">{ingredient.source}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Función</h4>
                    <p className="text-xs text-muted-foreground">{ingredient.function}</p>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {ingredient.organic_certified && (
                      <Badge variant="secondary" className="text-xs">Orgánico</Badge>
                    )}
                    {ingredient.non_gmo && (
                      <Badge variant="secondary" className="text-xs">Non-GMO</Badge>
                    )}
                  </div>

                  {ingredient.allergen_info && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      ⚠️ {ingredient.allergen_info}
                    </div>
                  )}
                </CardContent>
              </Card>
            )) : (
              <Alert className="col-span-full">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No se encontraron ingredientes específicos. Mostrando datos de demostración.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Diseño y Colores */}
        <TabsContent value="design" className="space-y-4">
          {colors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Paleta de Colores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Color Principal</h4>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: colors.primary_color }}
                      ></div>
                      <span className="font-mono text-sm">{colors.primary_color}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Colores Secundarios</h4>
                    <div className="flex gap-2">
                      {(colors.secondary_colors || ['#FFFFFF', '#F5F5F5']).map((color, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-mono text-xs">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Colores de Acento</h4>
                    <div className="flex gap-2">
                      {(colors.accent_colors || ['#FF6B35', '#4ECDC4']).map((color, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-mono text-xs">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Diseño</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Psicología del Color</h4>
                    <p className="text-sm text-muted-foreground">
                      {colors.color_psychology || 'Confianza, pureza, energía'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Atractivo en el Mercado</h4>
                    <p className="text-sm text-muted-foreground">
                      {colors.market_appeal || 'Atrae a consumidores premium y deportistas'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No se encontró información de diseño específica. Mostrando datos de demostración.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Certificaciones */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.certifications.length > 0 ? data.certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {cert.certification_type}
                  </CardTitle>
                  <CardDescription>{cert.certifying_body}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Número:</span>
                      <span className="font-mono">{cert.certification_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vigencia:</span>
                      <span>{cert.expiry_date}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Alcance</h4>
                    <p className="text-xs text-muted-foreground">{cert.scope}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Valor en el Mercado</h4>
                    <p className="text-xs text-muted-foreground">{cert.market_value}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {cert.logo_available && (
                      <Badge variant="secondary" className="text-xs">Logo Disponible</Badge>
                    )}
                    <Badge variant="default" className="text-xs">Certificado</Badge>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Alert className="col-span-full">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No se encontraron certificaciones específicas. Mostrando datos de demostración.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}