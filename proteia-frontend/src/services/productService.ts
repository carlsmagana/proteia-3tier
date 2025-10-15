import { api } from './api';

// Product types matching backend DTOs
export interface NutritionalInfo {
  energy?: number;
  protein?: number;
  totalFat?: number;
  carbohydrates?: number;
  dietaryFiber?: number;
  sodium?: number;
}

export interface ProductAnalysis {
  valueProposition?: string;
  keyLabels?: string;
  intendedSegment?: string;
  similarityScore?: number;
}

export interface Product {
  id: number;
  asin: string;
  productName: string;
  brand: string;
  category: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  estSales?: number;
  estRevenue?: number;
  url?: string;
  nutritionalInfo?: NutritionalInfo;
  productAnalysis?: ProductAnalysis;
}

export interface ProductSummary {
  id: number;
  asin: string;
  productName: string;
  brand: string;
  price: number;
  rating?: number;
  similarityScore?: number;
}

export class ProductService {
  /**
   * Get all products
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await api.get<Product[]>('/products');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error al cargar los productos');
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<Product> {
    try {
      return await api.get<Product>(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Error al cargar el producto');
    }
  }

  /**
   * Get product by ASIN
   */
  static async getProductByAsin(asin: string): Promise<Product> {
    try {
      return await api.get<Product>(`/products/asin/${asin}`);
    } catch (error) {
      console.error('Error fetching product by ASIN:', error);
      throw new Error('Error al cargar el producto');
    }
  }

  /**
   * Get products similar to Proteo50
   */
  static async getSimilarProducts(
    similarityThreshold: number = 0.5,
    topN: number = 20
  ): Promise<ProductSummary[]> {
    try {
      const params = new URLSearchParams({
        similarityThreshold: similarityThreshold.toString(),
        topN: topN.toString(),
      });
      
      return await api.get<ProductSummary[]>(`/products/similar?${params}`);
    } catch (error) {
      console.error('Error fetching similar products:', error);
      throw new Error('Error al cargar productos similares');
    }
  }

  /**
   * Search products by term
   */
  static async searchProducts(searchTerm: string): Promise<ProductSummary[]> {
    try {
      const params = new URLSearchParams({ searchTerm });
      return await api.get<ProductSummary[]>(`/products/search?${params}`);
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Error en la búsqueda de productos');
    }
  }

  /**
   * Get products by brand
   */
  static async getProductsByBrand(brand: string): Promise<ProductSummary[]> {
    try {
      return await api.get<ProductSummary[]>(`/products/brand/${encodeURIComponent(brand)}`);
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw new Error('Error al cargar productos por marca');
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<ProductSummary[]> {
    try {
      return await api.get<ProductSummary[]>(`/products/category/${encodeURIComponent(category)}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Error al cargar productos por categoría');
    }
  }

  /**
   * Get Proteo50 information
   */
  static async getProteo50(): Promise<Product> {
    try {
      return await api.get<Product>('/products/proteo50');
    } catch (error) {
      console.error('Error fetching Proteo50:', error);
      throw new Error('Error al cargar información de Proteo50');
    }
  }
}
