// Adaptador para convertir datos entre diferentes formatos
import { ConsolidatedProduct } from '../data/consolidated-products';
import { MarketProduct } from '../data/mexico-market-sample';

// Convertir MarketProduct a ConsolidatedProduct
export function adaptMarketProductToConsolidated(marketProduct: MarketProduct): ConsolidatedProduct {
  return {
    productName: marketProduct.nombre_producto,
    brand: marketProduct.marca,
    category: marketProduct.categoria,
    searchCount: marketProduct.busquedas_mensuales,
    searchTerm: "Proteina",
    price: marketProduct.precio,
    avgPricePerMonth: marketProduct.precio,
    netMargin: marketProduct.margen_neto,
    lqs: 80, // Default LQS
    reviewCount: marketProduct.num_reviews,
    rating: marketProduct.rating,
    minPrice: marketProduct.precio,
    net: marketProduct.precio * 0.75, // Estimado
    fbaFees: marketProduct.precio * 0.25, // Estimado
    scoreForPL: 7, // Default
    scoreForReselling: 8, // Default
    sellersCount: 1, // Default
    rank: 100, // Default
    avgBSRPerMonth: 100, // Default
    inventory: 30, // Default
    estSales: marketProduct.ventas_estimadas,
    estRevenue: marketProduct.revenue_estimado,
    pageSalesShare: "1%", // Default
    pageRevShare: "1%", // Default
    revPerReview: marketProduct.revenue_estimado / marketProduct.num_reviews,
    profitPotential: marketProduct.profit_potential,
    availableFrom: marketProduct.fecha_analisis,
    bestSellerIn: "",
    aPlus: marketProduct.certificaciones?.includes("A+ Content") || false,
    weight: marketProduct.peso,
    sellerType: marketProduct.tipo_vendedor,
    variants: marketProduct.variantes,
    asin: marketProduct.asin,
    url: `https://www.amazon.com.mx/dp/${marketProduct.asin}`
  };
}

// Convertir array de MarketProduct a ConsolidatedProduct
export function adaptMarketProductsToConsolidated(marketProducts: MarketProduct[]): ConsolidatedProduct[] {
  return marketProducts.map(adaptMarketProductToConsolidated);
}