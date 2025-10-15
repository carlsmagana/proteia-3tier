import { productsMarket } from './products-market';
import { selectedProductAnalyses } from './selected-products';

// Información cualitativa complementaria del análisis de productos
export interface ProductAnalysis {
  asin: string;
  productName: string;
  nutritionalValues: string;
  ingredients: string;
  valueProposition: string;
  keyLabels: string;
  primaryColors: string;
  secondaryColors: string;
  intendedSegment: string;
  additionalNotes: string;
}

// Interfaz para productos consolidados del CSV principal
export interface ConsolidatedProduct {
  productName: string;
  brand: string;
  category: string;
  searchCount: number;
  searchTerm: string;
  price: number;
  avgPricePerMonth: number;
  netMargin: number;
  lqs: number;
  reviewCount: number;
  rating: number;
  minPrice: number;
  net: number;
  fbaFees: number;
  scoreForPL: number;
  scoreForReselling: number;
  sellersCount: number;
  rank: number;
  avgBSRPerMonth: number;
  inventory: number;
  estSales: number;
  estRevenue: number;
  pageSalesShare: string;
  pageRevShare: string;
  revPerReview: number;
  profitPotential: number;
  availableFrom: string;
  bestSellerIn: string;
  aPlus: boolean;
  weight: number;
  sellerType: string;
  variants: number;
  asin: string;
  url: string;
  analysis?: ProductAnalysis;
  pricePerKg: number | null;
}

const analysisDictionary: Record<string, ProductAnalysis> = selectedProductAnalyses.reduce(
  (acc, analysis) => {
    acc[analysis.asin] = analysis;
    return acc;
  },
  {} as Record<string, ProductAnalysis>
);

const sanitizedProducts: ConsolidatedProduct[] = productsMarket.map(product => {
  const weight = product.weight;
  const price = product.price;
  return {
    ...product,
    analysis: analysisDictionary[product.asin],
    pricePerKg:
      typeof product.pricePerKg === 'number'
        ? product.pricePerKg
        : weight > 0
        ? price / weight
        : null
  };
});

// Función para procesar el CSV y convertirlo a la interfaz
export function processConsolidatedData(
  csvData: string,
  analysisByAsin: Record<string, ProductAnalysis> = analysisDictionary
): ConsolidatedProduct[] {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const products: ConsolidatedProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;

    const asin = cleanValue(values[32]);

    const weight = toNumber(cleanValue(values[29]));
    const price = toNumber(cleanValue(values[5]));
    const product: ConsolidatedProduct = {
      productName: cleanValue(values[0]),
      brand: cleanValue(values[1]),
      category: cleanValue(values[2]),
      searchCount: toNumber(cleanValue(values[3])),
      searchTerm: cleanValue(values[4]),
      price,
      avgPricePerMonth: toNumber(cleanValue(values[6])),
      netMargin: toNumber(cleanValue(values[7])),
      lqs: toNumber(cleanValue(values[8])),
      reviewCount: toNumber(cleanValue(values[9])),
      rating: toNumber(cleanValue(values[10])),
      minPrice: toNumber(cleanValue(values[11])),
      net: toNumber(cleanValue(values[12])),
      fbaFees: toNumber(cleanValue(values[13])),
      scoreForPL: toNumber(cleanValue(values[14])),
      scoreForReselling: toNumber(cleanValue(values[15])),
      sellersCount: toNumber(cleanValue(values[16])),
      rank: toNumber(cleanValue(values[17])),
      avgBSRPerMonth: toNumber(cleanValue(values[18])),
      inventory: toNumber(cleanValue(values[19])),
      estSales: toNumber(cleanValue(values[20])),
      estRevenue: toNumber(cleanValue(values[21])),
      pageSalesShare: cleanValue(values[22]),
      pageRevShare: cleanValue(values[23]),
      revPerReview: toNumber(cleanValue(values[24])),
      profitPotential: toNumber(cleanValue(values[25])),
      availableFrom: cleanValue(values[26]),
      bestSellerIn: cleanValue(values[27]),
      aPlus: cleanValue(values[28]).toLowerCase() === 'true',
      weight,
      sellerType: cleanValue(values[30]),
      variants: toNumber(cleanValue(values[31])),
      asin,
      url: cleanValue(values[33]),
      analysis: analysisByAsin[asin],
      pricePerKg: weight > 0 ? price / weight : null
    };

    products.push(product);
  }

  return products;
}

// Función auxiliar para limpiar valores del CSV
function cleanValue(value: string): string {
  return value.replace(/^"|"$/g, '').replace(/\r/g, '').trim();
}

// Función auxiliar para parsear líneas del CSV que pueden tener comillas
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function toNumber(value: string): number {
  if (!value) return 0;
  const sanitized = value.replace(/[^0-9+\-\.]/g, '');
  const parsed = parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function loadProductAnalysis(): Promise<Record<string, ProductAnalysis>> {
  return analysisDictionary;
}

export async function loadConsolidatedProducts(): Promise<ConsolidatedProduct[]> {
  return sanitizedProducts;
}

export const consolidatedProducts = sanitizedProducts;

// Función para calcular métricas de resumen
export function calculateMarketMetrics(products: ConsolidatedProduct[]) {
  const totalProducts = products.length;
  const uniqueBrands = new Set(products.map(p => p.brand)).size;
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
  const totalRevenue = products.reduce((sum, p) => sum + p.estRevenue, 0);
  const pricePerKgValues = products
    .map(p => p.pricePerKg)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0);
  const avgPricePerKg = pricePerKgValues.length
    ? pricePerKgValues.reduce((sum, value) => sum + value, 0) / pricePerKgValues.length
    : 0;

  const categoryDistribution = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const brandDistribution = products.reduce((acc, p) => {
    if (!acc[p.brand]) {
      acc[p.brand] = {
        products: 0,
        totalRevenue: 0,
        avgRating: 0,
        avgPrice: 0
      };
    }
    acc[p.brand].products += 1;
    acc[p.brand].totalRevenue += p.estRevenue;
    acc[p.brand].avgRating += p.rating;
    acc[p.brand].avgPrice += p.price;
    return acc;
  }, {} as Record<string, any>);

  // Calcular promedios para marcas
  Object.keys(brandDistribution).forEach(brand => {
    const brandData = brandDistribution[brand];
    brandData.avgRating = brandData.avgRating / brandData.products;
    brandData.avgPrice = brandData.avgPrice / brandData.products;
  });

  return {
    totalProducts,
    uniqueBrands,
    avgPrice,
    avgRating,
    totalRevenue,
    avgPricePerKg,
    categoryDistribution,
    brandDistribution
  };
}
