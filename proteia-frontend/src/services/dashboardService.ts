import { api } from './api';
import { ProductSummary } from './productService';

// Dashboard types matching backend DTOs
export interface CategoryStats {
  name: string;
  productCount: number;
  averagePrice: number;
  totalRevenue: number;
}

export interface BrandStats {
  name: string;
  productCount: number;
  averagePrice: number;
  averageRating: number;
  totalRevenue: number;
  averageProtein: number;
}

export interface MarketOverview {
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  totalRevenue: number;
  categoryStats: CategoryStats[];
  brandStats: BrandStats[];
}

export interface ProductComparison {
  proteo50: ProductSummary;
  similarProducts: ProductSummary[];
  competitorProducts: ProductSummary[];
}

export interface Prospect {
  id: number;
  productName: string;
  brand: string;
  price: number;
  similarityScore?: number;
  protein?: number;
  intendedSegment?: string;
  opportunityReason: string;
}

export interface Opportunity {
  category: string;
  description: string;
  potentialRevenue: number;
  productCount: number;
  averagePrice: number;
}

export interface ProspectRanking {
  topProspects: Prospect[];
  marketOpportunities: Opportunity[];
}

export class DashboardService {
  /**
   * Get market overview data
   */
  static async getMarketOverview(): Promise<MarketOverview> {
    try {
      return await api.get<MarketOverview>('/dashboard/market-overview');
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw new Error('Error al cargar la vista general del mercado');
    }
  }

  /**
   * Get product comparison data
   */
  static async getProductComparison(): Promise<ProductComparison> {
    try {
      return await api.get<ProductComparison>('/dashboard/product-comparison');
    } catch (error) {
      console.error('Error fetching product comparison:', error);
      throw new Error('Error al cargar la comparación de productos');
    }
  }

  /**
   * Get prospect ranking data
   */
  static async getProspectRanking(): Promise<ProspectRanking> {
    try {
      return await api.get<ProspectRanking>('/dashboard/prospect-ranking');
    } catch (error) {
      console.error('Error fetching prospect ranking:', error);
      throw new Error('Error al cargar el ranking de prospectos');
    }
  }

  /**
   * Get brand analysis data
   */
  static async getBrandAnalysis(): Promise<BrandStats[]> {
    try {
      return await api.get<BrandStats[]>('/dashboard/brand-analysis');
    } catch (error) {
      console.error('Error fetching brand analysis:', error);
      throw new Error('Error al cargar el análisis por marcas');
    }
  }

  /**
   * Get category analysis data
   */
  static async getCategoryAnalysis(): Promise<CategoryStats[]> {
    try {
      return await api.get<CategoryStats[]>('/dashboard/category-analysis');
    } catch (error) {
      console.error('Error fetching category analysis:', error);
      throw new Error('Error al cargar el análisis por categorías');
    }
  }
}
