// Productos del cliente para comparación y análisis
export interface ClientProduct {
  id: string;
  name: string;
  category: string;
  status: 'development' | 'testing' | 'production' | 'planned';
  description: string;
  valueProposition: string;
  
  // Información nutricional por 100g
  nutritionalProfile: {
    energy: number | string; // kcal o "NA"
    protein: number | string; // g o "NA"
    fat: number | string; // g o "NA"
    carbohydrates: number | string; // g o "NA"
    fiber: number | string; // g (fibra dietética) o "NA"
    sodium: number | string; // mg o "NA"
    betaGlucano?: number | string; // g específico para productos con β-glucano
    ash?: number; // g (cenizas/minerales)
    moisture?: number; // g (humedad)
    availableCarbs?: number; // g (carbohidratos disponibles)
  };
  
  // Rangos observados por lote (solo para Proteo50)
  ranges?: {
    protein: { min: number; max: number; unit: '%' };
    fiber: { min: number; max: number; unit: '%' };
    fat: { min: number; max: number; unit: '%' };
    ash: { min: number; max: number; unit: '%' };
    moisture: { min: number; max: number; unit: '%' };
    bulkDensity: { min: number; max: number; unit: 'g/mL' };
    pH: { min: number; max: number };
  };
  
  // Propiedades físicas y tecnológicas
  physicalProperties?: {
    appearance: string;
    color: string;
    texture?: string;
    odorTaste?: string;
    apparentDensity?: { min: number; max: number; unit: 'g/mL' };
    pH?: { min: number; max: number };
    granulometry?: string;
    handlingNotes?: string[];
  };
  
  // Microbiología (principalmente para Proteo50)
  microbiology?: {
    aerobicMesophiles: string; // UFC/g
    moldsYeasts: string; // UFC/g
    coliforms: string; // g⁻¹
    notes: string;
  };
  
  // Características específicas del producto
  characteristics: string[];
  
  // Características comerciales
  commercial: {
    targetMarkets: string[];
    regulatoryFramework: string[];
    applications: string[];
    inclusionRates?: string[];
    claimsAllowed: string[];
  };
  
  // Metadata
  lastUpdated: string;
  developmentStage: string;
  nextMilestone: string;
}

export const clientProducts: ClientProduct[] = [
  {
    id: 'proteo50',
    name: 'Proteo50',
    category: 'Ingrediente Base',
    status: 'production',
    description: 'Concentrado proteico de levadura con alto contenido de proteína y fibra, bajo en carbohidratos disponibles y grasa moderada-baja. Aporta notas umami naturales (nucleótidos/peptídica).',
    valueProposition: 'Alto en proteína y fibra con carbohidratos disponibles muy bajos. Perfil umami natural que permite reducir sodio manteniendo palatibilidad. Péptidos de levadura como diferenciadores funcionales.',
    
    nutritionalProfile: {
      energy: 304,
      protein: 47.8,
      fat: 5.1,
      carbohydrates: 3.2,
      fiber: 26.7,
      sodium: 320, // Estimado basado en cenizas
      ash: 8.6,
      moisture: 8.6,
      availableCarbs: 3.2
    },
    
    ranges: {
      protein: { min: 41.0, max: 53.7, unit: '%' },
      fiber: { min: 18.6, max: 33.7, unit: '%' },
      fat: { min: 1.0, max: 9.7, unit: '%' },
      ash: { min: 6.8, max: 9.7, unit: '%' },
      moisture: { min: 7.0, max: 10.0, unit: '%' },
      bulkDensity: { min: 0.24, max: 0.40, unit: 'g/mL' },
      pH: { min: 7.0, max: 8.5 }
    },
    
    physicalProperties: {
      appearance: 'Polvo fino',
      color: 'Beige / café claro',
      texture: 'Polvo fino',
      odorTaste: 'Neutro-umami característico de levadura',
      apparentDensity: { min: 0.24, max: 0.40, unit: 'g/mL' },
      pH: { min: 7.0, max: 8.5 },
      granulometry: 'Variable (0% hasta ~49% retenido en malla #60)',
      handlingNotes: [
        'Densidad aparente baja: considerar control de flujo/dosificación',
        'Variación en granulometría: tamizado o micronización según aplicación'
      ]
    },
    
    microbiology: {
      aerobicMesophiles: '<5.0e3 UFC/g',
      moldsYeasts: '<1.0e2 UFC/g',
      coliforms: '<10 g⁻¹',
      notes: 'Se registra al menos un lote histórico NO CUMPLE. Valores típicos reportados en COAs internos.'
    },
    
    characteristics: [
      'Estabilidad en seco (<10% humedad)',
      'Origen biotecnológico',
      'Perfil umami natural',
      'Alto contenido proteico y fibra',
      'Versatilidad en aplicaciones'
    ],
    
    commercial: {
      targetMarkets: ['México', 'Latinoamérica'],
      regulatoryFramework: ['NOM-051', 'COFEPRIS', 'NOM-251'],
      applications: [
        'Seasonings/bases (0.8–2.0%)',
        'Snacks extruidos (3–8%)',
        'RTD vegetal/nutricional (1–3%)',
        'Cárnicos/análogo (3–6%)',
        'Pet-food croqueta (2–6%)'
      ],
      inclusionRates: ['0.8-2% bases culinarias', '3-8% snacks', '1-3% RTD', '3-6% cárnicos', '2-6% pet-food'],
      claimsAllowed: ['Alto en proteína', 'Fuente de fibra', 'Bajo en carbohidratos', 'Origen natural']
    },
    
    lastUpdated: '2025-01-30',
    developmentStage: 'Comercialización activa',
    nextMilestone: 'Expansión aplicaciones Q2 2025'
  },
  {
    id: 'yeast-beta-glucan-complex',
    name: 'Yeast β-glucan complex',
    category: 'Nutracéutico',
    status: 'development',
    description: 'Suplemento en cápsula o stick con complejo de β-glucanos derivados de levadura estandarizada, dirigido a fortalecer el sistema inmune y reducir la sensación de fatiga.',
    valueProposition: 'Aporta un inmunoestimulante natural respaldado por estudios en humanos, con presentaciones cómodas (cápsula/stick), alto margen y claim de "apoyo" que cumple regulación COFEPRIS.',
    
    nutritionalProfile: {
      energy: 120,
      protein: 15,
      fat: 1.5,
      carbohydrates: 10,
      fiber: 6,
      sodium: 40,
      betaGlucano: 15
    },
    
    characteristics: [
      'Sin octágonos (NOM-051 no aplica)',
      'Dosis flexible (150–300mg β-glucano/día)',
      'Presentación portable (empaque stick/cápsula)',
      'Ingrediente estandarizado por métodos HPLC/enzimático'
    ],
    
    commercial: {
      targetMarkets: ['México', 'Consumidores wellness'],
      regulatoryFramework: ['COFEPRIS Suplemento Alimenticio', 'NOM-251 BPM'],
      applications: [
        'Cápsulas 150-300mg β-glucano/día',
        'Sticks portables',
        'Blend metabolic-support polvo para bebida'
      ],
      claimsAllowed: ['Apoya el sistema inmune', 'Ayuda con la fatiga', 'Ingrediente natural']
    },
    
    lastUpdated: '2025-01-25',
    developmentStage: 'Desarrollo de formulación',
    nextMilestone: 'Pruebas de estabilidad Q2 2025'
  },
  {
    id: 'bouillon-low-sodium-protein',
    name: 'Bouillon/bases low sodium + protein',
    category: 'Alimento Bajo en Sodio',
    status: 'development',
    description: 'Base culinaria premium en polvo/líquido, combinando reducción de sodio (>20%) con proteína adicional vía extracto de levadura Proteo50, orientada a food-service y marcas gourmet.',
    valueProposition: 'Permite reformular recetas reduciendo sodio sin sacrificar sabor, evitando octágonos de exceso y resaltando aporte proteico/umami natural.',
    
    nutritionalProfile: {
      energy: 180,
      protein: 20,
      fat: 3,
      carbohydrates: 10,
      fiber: 2,
      sodium: 900,
      betaGlucano: 5
    },
    
    characteristics: [
      'Reducción de sodio ≥ 20-30%',
      'Aporte proteinico en bouillon (0.8–2% de fórmula)',
      'Perfil de sabor umami derivado de nucleótidos y péptidos',
      'Cumple simulaciones NOM-051'
    ],
    
    commercial: {
      targetMarkets: ['México', 'Food-service', 'Marcas gourmet'],
      regulatoryFramework: ['NOM-051 octágonos', 'Declaración de sodio y energía'],
      applications: [
        'Base culinaria polvo/líquido concentrado',
        'Sazonador gourmet umami',
        'Reformulación productos existentes'
      ],
      claimsAllowed: ['Reducido en sodio', 'Con proteína añadida', 'Sabor umami natural']
    },
    
    lastUpdated: '2025-01-25',
    developmentStage: 'Desarrollo de formulación',
    nextMilestone: 'Pruebas sensoriales Q2 2025'
  },
  {
    id: 'beta-glucan-repair-serum',
    name: 'β-Glucan Repair Serum',
    category: 'Cosmético/Dermocare',
    status: 'planned',
    description: 'Suero cosmético con 1–3% de β-glucano de levadura, para hidratación, refuerzo de barrera cutánea y uso post-procedimientos.',
    valueProposition: 'Ingrediente "biotech-derived" con claims de "mejora de barrera e hidratación" aceptados; dirigido a consumidor premium y canales dermocosméticos.',
    
    nutritionalProfile: {
      energy: 'NA',
      protein: 'NA',
      fat: 'NA',
      carbohydrates: 'NA',
      fiber: 'NA',
      sodium: 'NA',
      betaGlucano: 3
    },
    
    characteristics: [
      'Compatibilidad INCI y cumplimiento NOM-259',
      'Test de estabilidad 40°C — 4 semanas',
      'Uso seguro en piel sensible/irritada',
      'Formulación sin claims terapéuticos'
    ],
    
    commercial: {
      targetMarkets: ['México', 'Consumidor premium', 'Canales dermocosméticos'],
      regulatoryFramework: ['NOM-259 BPF cosméticos', 'Rotulado INCI'],
      applications: [
        'Suero 1–3% β-glucano grado cosmético',
        'Gel/crema post-procedimiento',
        'Productos de hidratación facial'
      ],
      claimsAllowed: ['Hidratación', 'Soporte de barrera', 'Calma/suavidad post-procedimiento']
    },
    
    lastUpdated: '2025-01-25',
    developmentStage: 'Planeación inicial',
    nextMilestone: 'Investigación de mercado Q3 2025'
  },
  {
    id: 'pet-topper-beta-glucano',
    name: 'Topper palatable β-glucano para mascotas',
    category: 'Pet-care',
    status: 'development',
    description: 'Sazonador umami natural para croquetas/mezcla diaria, con 2–6% Proteo50 y adición de β-glucano para soporte a inmunidad, digestivo y palatabilidad.',
    valueProposition: 'Permite diferenciar alimento pet-premium mejorando aceptación y promoviendo beneficios funcionales, cumpliendo estándares NOM-012 y SENASICA.',
    
    nutritionalProfile: {
      energy: 280,
      protein: 40,
      fat: 7,
      carbohydrates: 20,
      fiber: 12,
      sodium: 450,
      betaGlucano: 5
    },
    
    characteristics: [
      'Soluble y apetecible (umami marcante)',
      'Claims prudentes en etiqueta (apoyo digestivo/inmune)',
      'Control microbiológico y físico-químico para PET',
      'Formato polvo-palatable para mezcla fácil'
    ],
    
    commercial: {
      targetMarkets: ['México', 'Pet-care premium', 'Distribuidores veterinarios'],
      regulatoryFramework: ['NOM-012-SAG/ZOO-2020', 'SENASICA'],
      applications: [
        'Sazonador seco para mezclar',
        'Suplemento masticable β-glucano',
        'Topper funcional para croquetas'
      ],
      claimsAllowed: ['Apoyo digestivo', 'Apoyo inmune', 'Mejora palatabilidad', 'Ingrediente natural']
    },
    
    lastUpdated: '2025-01-25',
    developmentStage: 'Desarrollo de formulación',
    nextMilestone: 'Pruebas de palatabilidad Q2 2025'
  }
];

// Funciones de comparación entre productos del cliente
export function compareClientProducts(productA: ClientProduct, productB: ClientProduct) {
  // Función auxiliar para obtener valor numérico
  const getNumericValue = (value: number | string): number => {
    return typeof value === 'string' ? 0 : value;
  };

  const nutritionalDiff = {
    energy: getNumericValue(productB.nutritionalProfile.energy) - getNumericValue(productA.nutritionalProfile.energy),
    protein: getNumericValue(productB.nutritionalProfile.protein) - getNumericValue(productA.nutritionalProfile.protein),
    fiber: getNumericValue(productB.nutritionalProfile.fiber) - getNumericValue(productA.nutritionalProfile.fiber),
    fat: getNumericValue(productB.nutritionalProfile.fat) - getNumericValue(productA.nutritionalProfile.fat),
    carbohydrates: getNumericValue(productB.nutritionalProfile.carbohydrates) - getNumericValue(productA.nutritionalProfile.carbohydrates),
    sodium: getNumericValue(productB.nutritionalProfile.sodium) - getNumericValue(productA.nutritionalProfile.sodium),
    betaGlucano: getNumericValue(productB.nutritionalProfile.betaGlucano || 0) - getNumericValue(productA.nutritionalProfile.betaGlucano || 0)
  };

  return {
    productA: productA.name,
    productB: productB.name,
    categoryA: productA.category,
    categoryB: productB.category,
    nutritionalDifferences: nutritionalDiff,
    similarityScore: calculateClientProductSimilarity(productA, productB),
    recommendations: generateComparisonRecommendations(productA, productB, nutritionalDiff)
  };
}

export function calculateClientProductSimilarity(productA: ClientProduct, productB: ClientProduct): number {
  const weights = {
    protein: 0.25,
    fiber: 0.20,
    fat: 0.15,
    energy: 0.15,
    carbohydrates: 0.15,
    betaGlucano: 0.10
  };

  let similarity = 100;
  
  const aNutr = productA.nutritionalProfile;
  const bNutr = productB.nutritionalProfile;

  // Función auxiliar para obtener valor numérico
  const getNumericValue = (value: number | string): number => {
    return typeof value === 'string' ? 0 : value;
  };

  // Calcular diferencias ponderadas
  const proteinDiff = Math.abs(getNumericValue(aNutr.protein) - getNumericValue(bNutr.protein));
  const fiberDiff = Math.abs(getNumericValue(aNutr.fiber) - getNumericValue(bNutr.fiber));
  const fatDiff = Math.abs(getNumericValue(aNutr.fat) - getNumericValue(bNutr.fat));
  const energyDiff = Math.abs(getNumericValue(aNutr.energy) - getNumericValue(bNutr.energy)) / 10;
  const carbsDiff = Math.abs(getNumericValue(aNutr.carbohydrates) - getNumericValue(bNutr.carbohydrates));
  const betaGlucanDiff = Math.abs(getNumericValue(aNutr.betaGlucano || 0) - getNumericValue(bNutr.betaGlucano || 0));

  similarity -= proteinDiff * weights.protein;
  similarity -= fiberDiff * weights.fiber;
  similarity -= fatDiff * weights.fat;
  similarity -= energyDiff * weights.energy;
  similarity -= carbsDiff * weights.carbohydrates;
  similarity -= betaGlucanDiff * weights.betaGlucano;

  return Math.max(0, Math.min(100, similarity));
}

function generateComparisonRecommendations(
  productA: ClientProduct, 
  productB: ClientProduct, 
  differences: any
): string[] {
  const recommendations: string[] = [];

  // Función auxiliar para obtener valor numérico
  const getNumericValue = (value: number | string): number => {
    return typeof value === 'string' ? 0 : value;
  };

  const proteinDiff = Math.abs(differences.protein);
  const fiberDiff = Math.abs(differences.fiber);
  const fatDiff = Math.abs(differences.fat);
  const carbsDiff = Math.abs(differences.carbohydrates);

  if (proteinDiff > 10) {
    recommendations.push(`Diferencia significativa en proteína (${differences.protein > 0 ? '+' : ''}${differences.protein.toFixed(1)}g)`);
  }

  if (fiberDiff > 5) {
    recommendations.push(`Diferencia importante en fibra (${differences.fiber > 0 ? '+' : ''}${differences.fiber.toFixed(1)}g)`);
  }

  if (fatDiff > 3) {
    recommendations.push(`Variación en contenido graso (${differences.fat > 0 ? '+' : ''}${differences.fat.toFixed(1)}g)`);
  }

  if (carbsDiff > 5) {
    recommendations.push(`Diferencia en carbohidratos (${differences.carbohydrates > 0 ? '+' : ''}${differences.carbohydrates.toFixed(1)}g)`);
  }

  // Recomendaciones específicas por categoría
  if (productA.category !== productB.category) {
    recommendations.push(`Categorías diferentes: ${productA.category} vs ${productB.category}`);
    recommendations.push('Considerar sinergias entre aplicaciones');
  }

  if (productA.category === 'Ingrediente Base' || productB.category === 'Ingrediente Base') {
    recommendations.push('Proteo50 puede servir como base para otros productos');
  }

  if (recommendations.length === 0) {
    recommendations.push('Perfiles complementarios - oportunidad de portafolio integrado');
  }

  return recommendations;
}

// Análisis de compatibilidad con mercado mexicano
export function analyzeMarketCompatibility(product: ClientProduct) {
  const profile = product.nutritionalProfile;
  
  // Función auxiliar para obtener valor numérico
  const getNumericValue = (value: number | string): number => {
    return typeof value === 'string' ? 0 : value;
  };

  const protein = getNumericValue(profile.protein);
  const carbs = getNumericValue(profile.carbohydrates);
  const fiber = getNumericValue(profile.fiber);
  const energy = getNumericValue(profile.energy);
  const fat = getNumericValue(profile.fat);
  const betaGlucano = getNumericValue(profile.betaGlucano || 0);

  // Análisis específico por categoría
  let marketAlignment: any = {};
  let opportunities: string[] = [];

  switch (product.category) {
    case 'Ingrediente Base':
      marketAlignment = {
        proteinContent: protein > 40 ? 'Excelente' : protein > 30 ? 'Bueno' : 'Regular',
        fiberContent: fiber > 20 ? 'Ventaja competitiva' : fiber > 15 ? 'Competitivo' : 'Regular',
        functionalBenefits: betaGlucano > 3 ? 'Diferenciador' : 'Básico',
        versatility: 'Alta aplicabilidad'
      };
      if (protein > 40) opportunities.push('Ingrediente premium alto valor proteico');
      if (fiber > 25) opportunities.push('Líder en contenido de fibra funcional');
      if (betaGlucano > 3) opportunities.push('Claims funcionales β-glucanos');
      break;

    case 'Nutracéutico':
      marketAlignment = {
        regulatoryCompliance: 'COFEPRIS compatible',
        premiumPositioning: 'Ingrediente científicamente respaldado',
        marketTrend: 'Inmunidad y bienestar en crecimiento',
        formatInnovation: 'Stick/cápsula conveniente'
      };
      opportunities.push('Mercado inmunidad post-COVID');
      opportunities.push('Posicionamiento científico premium');
      opportunities.push('Canal farmacias y wellness');
      break;

    case 'Alimento Bajo en Sodio':
      marketAlignment = {
        nomCompliance: 'Evita octágonos exceso sodio',
        functionalBenefit: 'Mantiene palatabilidad',
        marketNeed: 'Demanda creciente bajo sodio',
        professionalUse: 'Food-service premium'
      };
      opportunities.push('Reformulación productos existentes');
      opportunities.push('Mercado gourmet y premium');
      opportunities.push('Food-service consciente salud');
      break;

    case 'Cosmético/Dermocare':
      marketAlignment = {
        ingredientTrend: 'Biotech-derived en auge',
        regulatoryFit: 'NOM-259 compatible',
        premiumChannel: 'Dermocosméticos en crecimiento',
        scientificBacking: 'Claims hidratación respaldados'
      };
      opportunities.push('Mercado K-beauty México');
      opportunities.push('Post-procedimientos estéticos');
      opportunities.push('Canal dermatológico profesional');
      break;

    case 'Pet-care':
      marketAlignment = {
        premiumPet: 'Segmento funcional en crecimiento',
        palatability: 'Mejora aceptación alimento',
        healthBenefits: 'Digestivo e inmune',
        regulatory: 'SENASICA compatible'
      };
      opportunities.push('Pet-care premium México');
      opportunities.push('Diferenciación funcional');
      opportunities.push('Canal veterinario especializado');
      break;

    default:
      marketAlignment = {
        general: 'Perfil nutricional balanceado'
      };
  }

  return {
    category: product.category,
    marketAlignment,
    opportunities,
    overallScore: calculateMarketScore(marketAlignment),
    recommendedApplications: product.commercial.applications,
    regulatoryStatus: product.commercial.regulatoryFramework
  };
}

function calculateMarketScore(alignment: any): number {
  const scores = {
    'Excelente': 25,
    'Bueno': 15,
    'Regular': 5,
    'Ventaja competitiva': 25,
    'Competitivo': 15,
    'Alineado': 20,
    'Moderado': 10,
    'Alto': 5
  };

  return Object.values(alignment).reduce((total: number, value: any) => {
    return total + (scores[value as keyof typeof scores] || 0);
  }, 0);
}

// Métricas de desarrollo del portafolio
export function getPortfolioMetrics() {
  const totalProducts = clientProducts.length;
  const statusDistribution = clientProducts.reduce((acc, product) => {
    acc[product.status] = (acc[product.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryDistribution = clientProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Función auxiliar para obtener valor numérico
  const getNumericValue = (value: number | string): number => {
    return typeof value === 'string' ? 0 : value;
  };

  // Calcular promedios solo para productos con valores numéricos
  const productsWithNutrition = clientProducts.filter(p => 
    typeof p.nutritionalProfile.protein === 'number' && 
    typeof p.nutritionalProfile.fiber === 'number'
  );

  let nutritionalAverages = {
    protein: 0,
    fiber: 0,
    energy: 0,
    betaGlucano: 0
  };

  if (productsWithNutrition.length > 0) {
    nutritionalAverages = {
      protein: productsWithNutrition.reduce((sum, p) => sum + getNumericValue(p.nutritionalProfile.protein), 0) / productsWithNutrition.length,
      fiber: productsWithNutrition.reduce((sum, p) => sum + getNumericValue(p.nutritionalProfile.fiber), 0) / productsWithNutrition.length,
      energy: productsWithNutrition.reduce((sum, p) => sum + getNumericValue(p.nutritionalProfile.energy), 0) / productsWithNutrition.length,
      betaGlucano: clientProducts.reduce((sum, p) => sum + getNumericValue(p.nutritionalProfile.betaGlucano || 0), 0) / totalProducts
    };
  }

  return {
    totalProducts,
    statusDistribution,
    categoryDistribution,
    nutritionalAverages,
    developmentPipeline: clientProducts.filter(p => p.status === 'development' || p.status === 'testing').length,
    productionReady: clientProducts.filter(p => p.status === 'production').length,
    diversificationIndex: Object.keys(categoryDistribution).length / totalProducts // Índice de diversificación
  };
}

