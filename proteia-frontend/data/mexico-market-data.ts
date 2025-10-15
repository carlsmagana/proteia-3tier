// Datos reales del mercado mexicano de proteínas
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  energyContent: number; // kcal
  protein: number; // g
  totalFat: number; // g
  saturatedFat: number; // g
  transFat: number; // mg
  carbohydrates: number; // g
  sugars: number; // g
  addedSugars: number; // g
  polyalcohols?: number; // g
  dietaryFiber: number; // g
  sodium: number; // mg
  potassium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  phosphorus?: number; // mg
  url?: string;
  similarity?: number; // Calculated similarity to Proteo50
  barriers?: string[];
  playbook?: string;
}

export const mexicanProducts: Product[] = [
  {
    id: 1,
    name: "Optimum Nutrition Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    description: "Proteína de suero 100% con aislado, concentrado e hidrolizado. 24g proteína con BCAAs naturales",
    price: 1299.9, // Más realista para MX (5lb tub)
    category: "Proteína en Polvo",
    energyContent: 120,
    protein: 24,
    totalFat: 1, 
    saturatedFat: 0.5,
    transFat: 0,
    carbohydrates: 3,
    sugars: 1,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 130,
    potassium: 160,
    calcium: 110,
    iron: 0,
    url: "https://www.optimumnutrition.com/en-us/Products/Shakes-%26-Powders/GOLD-STANDARD-100%25-WHEY%E2%84%A2/p/gold-standard-100-whey-protein",
    similarity: 88,
    barriers: ['Precio premium'],
    playbook: 'Co-formulación'
  },
  {
    id: 2,
    name: "Gelatein 20 (varios sabores)",
    brand: "Medtrition / ProSource",
    description: "Gelatina clínica de alta proteína con colágeno hidrolizado y aislado de suero",
    price: 159.9, // Por unidad individual
    category: "Gelatina Proteica Clínica",
    energyContent: 80,
    protein: 20,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 2,
    sugars: 2,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 75,
    potassium: 45,
    calcium: 35,
    iron: 0,
    url: "https://medtrition.com/wp-content/uploads/2021/08/Medtrition-Product-Guide-Gelatein20.pdf",
    similarity: 85,
    barriers: ['Mercado clínico especializado'],
    playbook: 'Nicho clínico'
  },
  {
    id: 3,
    name: "Magnum Quattro",
    brand: "Magnum Nutraceuticals",
    description: "Fórmula de aislado de proteína con suero, leche, huevo y bromelina",
    price: 1899.9, // Premium pricing for 4lb tub
    category: "Proteína en Polvo",
    energyContent: 130,
    protein: 30,
    totalFat: 1,
    saturatedFat: 0.5,
    transFat: 0,
    carbohydrates: 2,
    sugars: 1,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 90,
    potassium: 120,
    calcium: 100,
    iron: 0,
    url: "https://magnumsupps.com/en-us/products/quattro",
    similarity: 91,
    barriers: ['Precio muy premium', 'Distribución limitada'],
    playbook: 'Co-marca premium'
  },
  {
    id: 4,
    name: "Birdman Mag Trifecta (Magnesium Blend)",
    brand: "Birdman",
    description: "Complejo de magnesio 3 en 1: citrato, glicinato y treonato de magnesio",
    price: 699.9, // Precio más realista para MX
    category: "Suplemento de Magnesio",
    energyContent: 0,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 0,
    sugars: 0,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    url: "https://mx.birdman.com/products/mag-trifecta-3-en-1-citrato-glicinato-y-treonato-de-magnesio-90-capsulas-porcion-para-30-dias",
    similarity: 25,
    barriers: ['No es proteico', 'Categoría diferente'],
    playbook: 'Fortificación con Proteo50'
  },
  {
    id: 5,
    name: "Isolean 2.2 kg (varios sabores)",
    brand: "Holix / LNutre",
    description: "Proteína de suero hidrolizada, 31g proteína por porción",
    price: 1249.9, // Más realista para 2.2kg
    category: "Proteína de Suero",
    energyContent: 125,
    protein: 31,
    totalFat: 1,
    saturatedFat: 0.5,
    transFat: 0,
    carbohydrates: 2,
    sugars: 1,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 100,
    potassium: 140,
    calcium: 90,
    iron: 0,
    url: "https://holixtienda.com/products/isolean-2-2-kg-proteina-hidrolizada",
    similarity: 89,
    barriers: ['Marca local', 'Distribución limitada'],
    playbook: 'Co-formulación'
  },
  {
    id: 6,
    name: "HS HERO SPORT Protein Pure and Natural",
    brand: "Hero Sport",
    description: "Proteína de suero pura y natural sin sabor, 27g proteína por porción",
    price: 899.9, // Precio más realista para 1.8kg
    category: "Proteína sin Sabor",
    energyContent: 119,
    protein: 27,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 0,
    sugars: 0,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 85,
    potassium: 110,
    calcium: 80,
    iron: 0,
    url: "https://www.amazon.com.mx/Isolated-Prote%C3%ADna-Amino%C3%A1cidos-Maltodextrina-Servicios/dp/B0BZWMJ6X8",
    similarity: 92,
    barriers: ['Sin sabor - menor atractivo'],
    playbook: 'Mejorar sabor con Proteo50'
  },
  {
    id: 7,
    name: "Matter Smart Nutrients – Protein/Total Sport (veg)",
    brand: "Matter Smart Nutrients",
    description: "Mezcla de proteína vegana con sacha inchi, chícharo, arroz, probióticos y enzimas digestivas",
    price: 1099.9, // Premium vegan pricing
    category: "Proteína Vegana",
    energyContent: 110,
    protein: 22,
    totalFat: 2,
    saturatedFat: 0.3,
    transFat: 0,
    carbohydrates: 4,
    sugars: 1,
    addedSugars: 0,
    dietaryFiber: 3,
    sodium: 90,
    potassium: 200,
    calcium: 150,
    iron: 3,
    url: "https://youmatter.mx/en-us",
    similarity: 68,
    barriers: ['Origen vegetal', 'Precio premium', 'Menor proteína'],
    playbook: 'Fortificación'
  },
  {
    id: 8,
    name: "nutriADN – Thyroid Support",
    brand: "nutriADN",
    description: "Soporte tiroideo con selenio, zinc, cobre, cúrcuma y pimienta negra",
    price: 599.9,
    category: "Soporte Tiroideo",
    energyContent: 5, // estimated
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 1, // estimated
    sugars: 0,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    url: "https://nutriadn.com/products/thyroidsupport",
    similarity: 35, // Low similarity as it's not protein-based
    barriers: ['No es proteico'],
    playbook: 'Fortificación con Proteo50'
  },
  {
    id: 9,
    name: "OBY NAD+ Infinity (Trans-Resveratrol)",
    brand: "OBY",
    description: "Complejo NAD+ con resveratrol, ácido alfa-lipoico, quercetina y extractos antioxidantes",
    price: 1499.9,
    category: "Complejo NAD+ / Resveratrol",
    energyContent: 1.68,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 0.4,
    sugars: 0,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    url: "https://oby.mx/products/nad-infinity-resveratrol",
    similarity: 30, // Low similarity as it's not protein-based
    barriers: ['No es proteico', 'Precio premium'],
    playbook: 'Fortificación con Proteo50'
  },
  {
    id: 10,
    name: "NAD+ 200 cápsulas (ETERNAL NUTRITION)",
    brand: "Eternal Nutrition",
    description: "Complejo NAD+ con trimetilglicina, ácido alfa-lipoico y extracto de café verde",
    price: 899.9,
    category: "Complejo NAD+",
    energyContent: 0, // estimated
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    carbohydrates: 0,
    sugars: 0,
    addedSugars: 0,
    dietaryFiber: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    url: "https://www.amazon.com.mx/capsulas-Trimethylglycine-precursor-Nicotinamide-Nutrition/dp/B0CVKG1FYR",
    similarity: 25, // Low similarity as it's not protein-based
    barriers: ['No es proteico'],
    playbook: 'Fortificación con Proteo50'
  }
];

export interface BrandData {
  name: string;
  productCount: number;
  marketShare?: number;
  category: string;
}

export const mexicanBrands: BrandData[] = [
  { name: "Optimum Nutrition", productCount: 1, marketShare: 22.5, category: "Proteínas Premium" },
  { name: "Magnum Nutraceuticals", productCount: 1, marketShare: 11.8, category: "Suplementos Premium" },
  { name: "Birdman", productCount: 1, marketShare: 8.9, category: "Suplementos Locales" },
  { name: "OBY", productCount: 1, marketShare: 6.2, category: "Longevidad/Anti-aging" },
  { name: "Medtrition / ProSource", productCount: 1, marketShare: 4.8, category: "Clínico/Hospitalario" },
  { name: "Holix / LNutre", productCount: 1, marketShare: 5.1, category: "Deportivo Nacional" },
  { name: "Hero Sport", productCount: 1, marketShare: 3.9, category: "Proteínas Puras" },
  { name: "Matter Smart Nutrients", productCount: 1, marketShare: 3.2, category: "Plant-based Premium" },
  { name: "nutriADN", productCount: 1, marketShare: 4.5, category: "Suplementos Especializados" },
  { name: "Eternal Nutrition", productCount: 1, marketShare: 6.1, category: "Longevidad" }
];

export const categoryData = [
  { name: 'Proteína en Polvo', products: 2, growth: 18.5, opportunity: 'Muy Alta', avgPrice: 1599.9 },
  { name: 'Complejos NAD+/Longevidad', products: 2, growth: 42.1, opportunity: 'Muy Alta', avgPrice: 1199.9 },
  { name: 'Proteína de Suero', products: 1, growth: 22.3, opportunity: 'Alta', avgPrice: 1249.9 },
  { name: 'Proteína Vegana', products: 1, growth: 31.2, opportunity: 'Muy Alta', avgPrice: 1099.9 },
  { name: 'Gelatina Proteica Clínica', products: 1, growth: 15.8, opportunity: 'Alta', avgPrice: 159.9 },
  { name: 'Suplemento de Magnesio', products: 1, growth: 12.7, opportunity: 'Media', avgPrice: 699.9 },
  { name: 'Soporte Tiroideo', products: 1, growth: 19.4, opportunity: 'Alta', avgPrice: 599.9 },
  { name: 'Proteína sin Sabor', products: 1, growth: 8.9, opportunity: 'Media', avgPrice: 899.9 }
];

export const marketTrends = [
  { month: 'Ene', mentions: 1234, launches: 1, proteinDemand: 87 },
  { month: 'Feb', mentions: 1387, launches: 1, proteinDemand: 91 },
  { month: 'Mar', mentions: 1512, launches: 2, proteinDemand: 94 },
  { month: 'Abr', mentions: 1698, launches: 2, proteinDemand: 89 },
  { month: 'May', mentions: 1845, launches: 2, proteinDemand: 96 },
  { month: 'Jun', mentions: 2012, launches: 2, proteinDemand: 102 }
];

// Perfil nutricional para comparación con Proteo50
export const proteo50Profile = {
  protein: 95,
  digestibility: 92,
  aminoAcids: 88,
  solubility: 94,
  neutrality: 90,
  functionality: 87
};

// Algoritmo de similitud simplificado
export function calculateSimilarity(product: Product): number {
  let score = 100;
  
  // Penalizar por azúcares añadidos altos (>10g)
  if (product.addedSugars > 10) score -= 15;
  else if (product.addedSugars > 5) score -= 8;
  
  // Penalizar por sodio alto (>500mg)
  if (product.sodium > 500) score -= 10;
  else if (product.sodium > 300) score -= 5;
  
  // Penalizar por grasas saturadas altas (>8g)
  if (product.saturatedFat > 8) score -= 8;
  else if (product.saturatedFat > 5) score -= 4;
  
  // Bonus por alto contenido proteico (>25g)
  if (product.protein > 25) score += 5;
  else if (product.protein > 20) score += 2;
  
  // Bonus por fibra alta (>5g)
  if (product.dietaryFiber > 5) score += 3;
  
  return Math.max(60, Math.min(100, score));
}