// Datos consolidados reales del mercado mexicano de proteínas 2025
// Fuente: productos_proteina_consolidados.csv

export interface MarketProduct {
  asin: string;
  nombre_producto: string;
  marca: string;
  categoria: string;
  precio: number;
  rating: number;
  num_reviews: number;
  descripcion: string;
  caracteristicas: string[];
  ingredientes?: string[];
  informacion_nutricional?: Record<string, string>;
  certificaciones?: string[];
  disponibilidad: string;
  vendedor: string;
  fecha_analisis: string;
  // Datos adicionales del análisis
  busquedas_mensuales: number;
  ventas_estimadas: number;
  revenue_estimado: number;
  margen_neto: number;
  peso: number;
  tipo_vendedor: string;
  variantes: number;
  profit_potential: number;
}

export const sampleMarketProducts: MarketProduct[] = [
  {
    asin: "B085WB2DCP",
    nombre_producto: "Birdman Falcon Performance Proteína Premium Alto Rendimiento En Polvo, 30gr proteína y 3gr Creatina por porción, Sin Inflamación, Sin Acné, Sabor Choco Bronze | 50 servicios | 1.9kg",
    marca: "BIRDMAN",
    categoria: "Salud y Cuidado Personal",
    precio: 1097.82,
    rating: 4.6,
    num_reviews: 5292,
    descripcion: "Proteína premium de alto rendimiento con creatina, ideal para deportistas que buscan máximo rendimiento sin efectos secundarios",
    caracteristicas: ["30g proteína por porción", "3g creatina", "Sin inflamación", "Sin acné", "50 servicios", "1.9kg"],
    ingredientes: ["Proteína de suero", "Creatina monohidratada", "Cacao", "Stevia"],
    informacion_nutricional: {
      "proteina": "30g",
      "creatina": "3g",
      "peso_porcion": "38g"
    },
    certificaciones: ["Amazon's Choice"],
    disponibilidad: "En stock",
    vendedor: "MCH",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 8,
    ventas_estimadas: 2725,
    revenue_estimado: 3330858,
    margen_neto: 77,
    peso: 4.45,
    tipo_vendedor: "MCH",
    variantes: 2,
    profit_potential: 209963.73
  },
  {
    asin: "B092HHCCNK",
    nombre_producto: "HABITS BY NOT A FANCY KITCHEN | Proteína Vegetal en Polvo | Sabor Vainilla 488 g | 21.5 g de Proteína Por Porción | Sin Azúcares Añadidos | Fuente de BCAAs, No GMO 16 Porciones",
    marca: "HABITS BY NOT A FANCY KITCHEN",
    categoria: "Alimentos y Bebidas",
    precio: 619,
    rating: 4.7,
    num_reviews: 868,
    descripcion: "Proteína vegetal premium con BCAAs naturales, ideal para veganos y personas con intolerancias",
    caracteristicas: ["21.5g proteína vegetal", "Sin azúcares añadidos", "Fuente de BCAAs", "No GMO", "16 porciones"],
    ingredientes: ["Proteína de arveja", "Proteína de arroz", "Sabor natural vainilla", "BCAAs"],
    informacion_nutricional: {
      "proteina": "21.5g",
      "azucar": "0g",
      "bcaas": "Natural"
    },
    certificaciones: ["Vegano", "No GMO"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 7,
    ventas_estimadas: 1000,
    revenue_estimado: 619000,
    margen_neto: 74,
    peso: 1.32,
    tipo_vendedor: "FBA",
    variantes: 1,
    profit_potential: 152073.33
  },
  {
    asin: "B07JXZBL71",
    nombre_producto: "BIRDMAN Falcon Protein Proteína Vegana Orgánica en Polvo | 7 Fuentes Vegetales | Con Enzimas y Probióticos | Sin Gluten | Sin Lácteos | Hipoalérgenico | Sabor Chocolate | 60 Porciones | 1.8kg",
    marca: "BIRDMAN",
    categoria: "Salud y Cuidado Personal",
    precio: 1396,
    rating: 4.7,
    num_reviews: 6354,
    descripcion: "Proteína vegana orgánica premium de 7 fuentes vegetales con enzimas digestivas y probióticos",
    caracteristicas: ["7 fuentes vegetales", "Enzimas y probióticos", "Sin gluten", "Sin lácteos", "Hipoalérgenico", "60 porciones"],
    ingredientes: ["Proteína de arveja", "Proteína de hemp", "Proteína de quinoa", "Enzimas digestivas", "Probióticos"],
    informacion_nutricional: {
      "proteina": "22g",
      "fuentes": "7 vegetales",
      "probioticos": "Incluidos"
    },
    certificaciones: ["Orgánico", "Vegano", "Sin Gluten"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 6,
    ventas_estimadas: 1368,
    revenue_estimado: 1748082,
    margen_neto: 79,
    peso: 4.1,
    tipo_vendedor: "FBA",
    variantes: 2,
    profit_potential: 167762.4
  },
  {
    asin: "B089P347JH",
    nombre_producto: "EVOLUTION, Proteína de Suero de Leche, WP100, Whey Protein, 18 Aminoácidos, Sin Gluten, Sugar Free, Post Workout, Sabor Chocolate, 42.7 Porciones, 1400g",
    marca: "ENC EVOLUTION NUTRACEUTICAL COMPANY",
    categoria: "Salud y Cuidado Personal",
    precio: 1040,
    rating: 4.7,
    num_reviews: 4068,
    descripcion: "Proteína de suero de leche con perfil completo de aminoácidos, ideal para post-entrenamiento",
    caracteristicas: ["18 aminoácidos", "Sin gluten", "Sugar free", "Post workout", "42.7 porciones"],
    ingredientes: ["Proteína de suero", "18 aminoácidos esenciales", "Sabor chocolate", "Stevia"],
    informacion_nutricional: {
      "proteina": "25g",
      "aminoacidos": "18",
      "azucar": "0g"
    },
    certificaciones: ["Sin Gluten", "Sugar Free"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 6,
    ventas_estimadas: 1537,
    revenue_estimado: 1492661,
    margen_neto: 77,
    peso: 3.53,
    tipo_vendedor: "FBA",
    variantes: 1,
    profit_potential: 1234918.02
  },
  {
    asin: "B07B33QR7C",
    nombre_producto: "Optimum Nutrition Gold Standard 100% Whey Doble Chocolate Bote",
    marca: "OPTIMUM NUTRITION",
    categoria: "Salud y Cuidado Personal",
    precio: 1799,
    rating: 4.5,
    num_reviews: 3628,
    descripcion: "El estándar de oro en proteínas de suero, marca líder mundial en suplementación deportiva",
    caracteristicas: ["100% Whey protein", "Doble chocolate", "Gold standard", "Marca premium", "Internacional"],
    ingredientes: ["Proteína de suero aislada", "Proteína de suero concentrada", "Cacao", "Lecitina"],
    informacion_nutricional: {
      "proteina": "24g",
      "leucina": "5.5g",
      "bcaas": "Naturales"
    },
    certificaciones: ["NSF Certified", "Informed Choice"],
    disponibilidad: "En stock",
    vendedor: "MCH",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 4,
    ventas_estimadas: 2378,
    revenue_estimado: 3820662,
    margen_neto: 80,
    peso: 5.62,
    tipo_vendedor: "MCH",
    variantes: 6,
    profit_potential: 3423535.26
  },
  {
    asin: "B00G6QHYZ6",
    nombre_producto: "Dymatize - Proteína hidrolizada en polvo. ISO100 Gourmet Vainilla 2.3Kg",
    marca: "Dymatize",
    categoria: "Salud y Cuidado Personal",
    precio: 1835,
    rating: 4.7,
    num_reviews: 6912,
    descripcion: "Proteína hidrolizada de absorción ultra rápida, la más pura del mercado con tecnología avanzada",
    caracteristicas: ["Proteína hidrolizada", "Absorción ultra rápida", "ISO100", "2.3kg", "Gourmet"],
    ingredientes: ["Proteína de suero hidrolizada", "Sabor vainilla", "Lecitina de girasol"],
    informacion_nutricional: {
      "proteina": "25g",
      "carbohidratos": "1g",
      "azucar": "1g"
    },
    certificaciones: ["Banned Substance Tested", "Inform Sport"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 3,
    ventas_estimadas: 604,
    revenue_estimado: 1112533,
    margen_neto: 80,
    peso: 5.73,
    tipo_vendedor: "FBA",
    variantes: 1,
    profit_potential: 177638.82
  },
  {
    asin: "B01BODRE50",
    nombre_producto: "Sascha Fitness Suplemento Alimenticio Proteína sabor Vainilla, 907 gr",
    marca: "SASCHA FITNESS",
    categoria: "Salud y Cuidado Personal",
    precio: 1549,
    rating: 4.6,
    num_reviews: 23856,
    descripcion: "Proteína respaldada por Sascha Fitness, influencer #1 en fitness latinoamericano",
    caracteristicas: ["Respaldo Sascha Fitness", "907g", "Sabor vainilla", "Suplemento alimenticio"],
    ingredientes: ["Proteína de suero", "Sabor vainilla", "Vitaminas", "Minerales"],
    informacion_nutricional: {
      "proteina": "24g",
      "vitaminas": "Incluidas",
      "minerales": "Incluidos"
    },
    certificaciones: ["Respaldo Celebrity"],
    disponibilidad: "En stock",
    vendedor: "MCH",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 3,
    ventas_estimadas: 760,
    revenue_estimado: 1455607,
    margen_neto: 80,
    peso: 2.62,
    tipo_vendedor: "MCH",
    variantes: 7,
    profit_potential: 470797.2
  },
  {
    asin: "B0CJ2KX7DL",
    nombre_producto: "KING PROTEIN | Proteína de suero sin sabor | 27 g de proteína con BCAA | Para antes y después del entrenamiento | Sin carbohidratos, conservantes, soja ni gluten | 900g, 30 raciones",
    marca: "KING Protein",
    categoria: "Alimentos y Bebidas",
    precio: 850,
    rating: 4.6,
    num_reviews: 115,
    descripcion: "Proteína pura sin sabor, ideal para mezclar con cualquier bebida o receta sin alterar el sabor",
    caracteristicas: ["Sin sabor", "27g proteína", "Con BCAA", "Sin carbohidratos", "30 raciones"],
    ingredientes: ["Proteína de suero concentrada", "BCAAs naturales"],
    informacion_nutricional: {
      "proteina": "27g",
      "carbohidratos": "0g",
      "bcaas": "Incluidos"
    },
    certificaciones: ["Sin Gluten", "Sin Soja"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 4,
    ventas_estimadas: 800,
    revenue_estimado: 680000,
    margen_neto: 76,
    peso: 2.07,
    tipo_vendedor: "FBA",
    variantes: 1,
    profit_potential: 518680
  },
  {
    asin: "B07KPPZD38",
    nombre_producto: "Hero Sport Proteina Chocolate 1kg. 25g de Whey Protein por Porción y 5.6g de BCAA's, 30 Porciones, 0 Sugar Adder, Endulzado con Monk Fruit, NON GMO, GLuten Free, Bottle Free.",
    marca: "HEROSPORTS",
    categoria: "Alimentos y Bebidas",
    precio: 575,
    rating: 4.3,
    num_reviews: 341,
    descripcion: "Proteína deportiva endulzada naturalmente con monk fruit, diseñada para atletas conscientes",
    caracteristicas: ["25g whey protein", "5.6g BCAAs", "Endulzado con monk fruit", "30 porciones", "Bottle free"],
    ingredientes: ["Proteína de suero", "BCAAs", "Monk fruit", "Cacao natural"],
    informacion_nutricional: {
      "proteina": "25g",
      "bcaas": "5.6g",
      "azucar_añadido": "0g"
    },
    certificaciones: ["Non GMO", "Gluten Free", "Bottle Free"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 4,
    ventas_estimadas: 50,
    revenue_estimado: 28750,
    margen_neto: 72,
    peso: 2.27,
    tipo_vendedor: "FBA",
    variantes: 8,
    profit_potential: 20585
  },
  {
    asin: "B0962HD47X",
    nombre_producto: "Proteína Vegetal De Chicharo Orgánica Premium 1KG",
    marca: "HEALTHY SUPERFOODS",
    categoria: "Salud y Cuidado Personal",
    precio: 450,
    rating: 4.7,
    num_reviews: 119,
    descripcion: "Proteína de chícharo orgánica premium, la opción más limpia y sostenible del mercado",
    caracteristicas: ["Proteína de chícharo", "Orgánica", "Premium", "1kg", "Sostenible"],
    ingredientes: ["Proteína de chícharo orgánica"],
    informacion_nutricional: {
      "proteina": "24g",
      "fibra": "2g",
      "hierro": "5mg"
    },
    certificaciones: ["Orgánico", "Vegano", "Sostenible"],
    disponibilidad: "En stock",
    vendedor: "FBA",
    fecha_analisis: "2025-01-01",
    busquedas_mensuales: 3,
    ventas_estimadas: 58,
    revenue_estimado: 26100,
    margen_neto: 70,
    peso: 2.27,
    tipo_vendedor: "FBA",
    variantes: 1,
    profit_potential: 18328
  }
];

// Datos consolidados adicionales para análisis
export const marketAnalysisData = {
  totalProducts: 100,
  avgPrice: 1047.95,
  avgRating: 4.5,
  totalRevenue: 50000000,
  topCategories: [
    { name: "Salud y Cuidado Personal", count: 85, percentage: 85 },
    { name: "Alimentos y Bebidas", count: 13, percentage: 13 },
    { name: "Productos para animales", count: 2, percentage: 2 }
  ],
  topBrands: [
    { name: "BIRDMAN", products: 12, revenue: 8500000 },
    { name: "HABITS BY NOT A FANCY KITCHEN", products: 8, revenue: 3200000 },
    { name: "OPTIMUM NUTRITION", products: 1, revenue: 3820662 },
    { name: "Dymatize", products: 3, revenue: 2800000 },
    { name: "ENC EVOLUTION NUTRACEUTICAL COMPANY", products: 4, revenue: 2100000 }
  ],
  priceSegments: [
    { range: "$0-500", count: 15, avgRating: 4.4 },
    { range: "$500-1000", count: 35, avgRating: 4.5 },
    { range: "$1000-1500", count: 38, avgRating: 4.6 },
    { range: "$1500+", count: 12, avgRating: 4.7 }
  ],
  opportunityMetrics: {
    highVolumeProducts: 25,
    premiumSegment: 40,
    veganProducts: 18,
    organicProducts: 8,
    avgProfitPotential: 145000
  }
};