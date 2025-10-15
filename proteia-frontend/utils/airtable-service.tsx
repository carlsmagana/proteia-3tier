import { AIRTABLE_CONFIG, AIRTABLE_TABLES, getAirtableUrl } from './airtable-config.tsx';

// Interfaz principal para productos del mercado mexicano 2025
export interface MarketProduct {
  id?: string;
  asin: string;
  nombre_producto: string;
  marca: string;
  categoria: string;
  precio: number;
  rating: number;
  num_reviews: number;
  url_imagen?: string;
  descripcion?: string;
  caracteristicas?: string[];
  ingredientes?: string[];
  informacion_nutricional?: {
    [key: string]: string;
  };
  certificaciones?: string[];
  disponibilidad?: string;
  vendedor?: string;
  fecha_analisis?: string;
  sales_metrics?: {
    [key: string]: any;
  };
}

// Interfaz para datos raw de Airtable
interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

class AirtableService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiKey = AIRTABLE_CONFIG.API_KEY;
    this.baseUrl = getAirtableUrl();
  }

  // Verificar configuración
  isConfigured(): boolean {
    return !!(this.apiKey && AIRTABLE_CONFIG.BASE_ID);
  }

  getConfigurationStatus(): {
    configured: boolean;
    apiKey: boolean;
    baseId: boolean;
    message: string;
  } {
    const apiKey = !!(this.apiKey && this.apiKey !== '');
    const baseId = !!(AIRTABLE_CONFIG.BASE_ID && AIRTABLE_CONFIG.BASE_ID !== '');
    const configured = apiKey && baseId;

    let message = '';
    if (!configured) {
      const missing = [];
      if (!apiKey) missing.push('API Key');
      if (!baseId) missing.push('Base ID');
      message = `Faltan configuraciones: ${missing.join(', ')}. Configure las variables de entorno AIRTABLE_API_KEY y AIRTABLE_BASE_ID.`;
    } else {
      message = 'Configuración completa';
    }

    return { configured, apiKey, baseId, message };
  }

  // Verificar conexión con Airtable
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const status = this.getConfigurationStatus();
      if (!status.configured) {
        return { success: false, message: status.message };
      }

      // Intentar hacer una consulta simple para verificar la conexión
      const response = await this.makeRequest('?maxRecords=1');
      
      return {
        success: true,
        message: `Conexión exitosa. Base: ${AIRTABLE_CONFIG.BASE_ID}, Tabla: ${AIRTABLE_CONFIG.TABLE_NAME}`,
        details: {
          baseId: AIRTABLE_CONFIG.BASE_ID,
          tableName: AIRTABLE_CONFIG.TABLE_NAME,
          recordCount: response.records?.length || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: { error: error instanceof Error ? error.message : error }
      };
    }
  }

  private async makeRequest(endpoint: string = '', options: RequestInit = {}) {
    // Verificar que tenemos las credenciales necesarias
    if (!this.apiKey || this.apiKey === '') {
      throw new Error('API Key de Airtable no configurado. Por favor configure AIRTABLE_API_KEY en las variables de entorno.');
    }

    if (!AIRTABLE_CONFIG.BASE_ID || AIRTABLE_CONFIG.BASE_ID === '') {
      throw new Error('Base ID de Airtable no configurado. Por favor configure AIRTABLE_BASE_ID en las variables de entorno.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }

        // Mensajes de error más específicos
        if (response.status === 401) {
          throw new Error('API Key de Airtable inválido o expirado. Genere un nuevo API Key desde https://airtable.com/account');
        } else if (response.status === 404) {
          throw new Error(`Base ID "${AIRTABLE_CONFIG.BASE_ID}" o tabla "${AIRTABLE_CONFIG.TABLE_NAME}" no encontrados. Verifique que el Base ID sea correcto y que la tabla existe.`);
        } else if (response.status === 403) {
          throw new Error(`Permisos insuficientes. El API Key necesita permisos de LECTURA para la base "${AIRTABLE_CONFIG.BASE_ID}". Vaya a https://airtable.com/account y configure los permisos de su token.`);
        } else if (response.status === 422) {
          throw new Error(`Error en la consulta: ${errorData.error?.message || 'Parámetros inválidos'}`);
        }

        throw new Error(errorData.error?.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifique su conexión a internet y que la URL de Airtable sea correcta.');
      }
      throw error;
    }
  }

  // Convierte un registro de Airtable a MarketProduct
  private parseAirtableRecord(record: AirtableRecord): MarketProduct | null {
    try {
      const fields = record.fields;
      
      return {
        id: record.id,
        asin: fields.ASIN || fields.asin || `GEN_${record.id.slice(-8)}`,
        nombre_producto: this.getFieldValue(fields, ['Product Name', 'nombre_producto', 'Nombre Producto', 'Name']) || 'Producto sin nombre',
        marca: this.getFieldValue(fields, ['Brand', 'marca', 'Marca']) || 'Marca no especificada',
        categoria: this.getFieldValue(fields, ['Category', 'categoria', 'Categoria']) || 'Sin categoría',
        precio: parseFloat(this.getFieldValue(fields, ['Price', 'precio', 'Precio']) || '0'),
        rating: parseFloat(this.getFieldValue(fields, ['Rating', 'rating', 'Calificacion']) || '0'),
        num_reviews: parseInt(this.getFieldValue(fields, ['# of Reviews', 'reviews', 'Reseñas', 'Reviews']) || '0'),
        url_imagen: this.getFieldValue(fields, ['Image URL', 'imagen', 'Imagen', 'Image']),
        descripcion: this.getFieldValue(fields, ['Description', 'descripcion', 'Descripcion']),
        caracteristicas: this.parseArrayField(this.getFieldValue(fields, ['Features', 'caracteristicas', 'Caracteristicas'])),
        ingredientes: this.parseArrayField(this.getFieldValue(fields, ['Ingredients', 'ingredientes', 'Ingredientes'])),
        informacion_nutricional: this.parseObjectField(this.getFieldValue(fields, ['Nutrition Info', 'nutricion', 'Nutricion', 'Nutrition'])),
        certificaciones: this.parseArrayField(this.getFieldValue(fields, ['Certifications', 'certificaciones', 'Certificaciones'])),
        disponibilidad: this.getFieldValue(fields, ['Availability', 'disponibilidad', 'Disponibilidad']) || 'Disponible',
        vendedor: this.getFieldValue(fields, ['Seller', 'vendedor', 'Vendedor']),
        fecha_analisis: this.getFieldValue(fields, ['Analysis Date', 'fecha_analisis']) || record.createdTime,
        sales_metrics: this.parseObjectField(this.getFieldValue(fields, ['Sales Metrics', 'Metrics', 'Sales']))
      };
    } catch (error) {
      console.error('Error parsing Airtable record:', error, record);
      return null;
    }
  }

  // Obtiene el primer valor encontrado de una lista de posibles nombres de campo
  private getFieldValue(fields: any, possibleNames: string[]): any {
    for (const name of possibleNames) {
      if (fields[name] !== undefined && fields[name] !== null && fields[name] !== '') {
        return fields[name];
      }
    }
    return null;
  }

  // Parsea campos que pueden ser arrays o strings
  private parseArrayField(field: any): string[] {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch {
        return field.split(',').map(s => s.trim()).filter(s => s);
      }
    }
    return [];
  }

  // Parsea campos que pueden ser objetos o strings
  private parseObjectField(field: any): { [key: string]: string } {
    if (!field) return {};
    if (typeof field === 'object') return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return { info: field };
      }
    }
    return {};
  }

  async getAllProducts(): Promise<MarketProduct[]> {
    try {
      // Verificar configuración antes de intentar la conexión
      const configStatus = this.getConfigurationStatus();
      if (!configStatus.configured) {
        console.warn('Airtable no configurado, usando datos de demostración:', configStatus.message);
        return this.getDemoProducts();
      }

      const products: MarketProduct[] = [];
      let offset: string | undefined;

      do {
        const params = new URLSearchParams();
        if (offset) params.append('offset', offset);
        params.append('maxRecords', '100');

        const response: AirtableResponse = await this.makeRequest(`?${params.toString()}`);
        
        const parsedProducts = response.records
          .map(record => this.parseAirtableRecord(record))
          .filter((product): product is MarketProduct => product !== null);
        
        products.push(...parsedProducts);
        offset = response.offset;
      } while (offset);

      console.log(`✅ Productos cargados exitosamente: ${products.length} productos encontrados`);
      return products;
    } catch (error) {
      console.error('Error fetching products from Airtable:', error);
      console.warn('Fallback a datos de demostración debido a error de Airtable');
      return this.getDemoProducts();
    }
  }

  async getProduct(asin: string): Promise<MarketProduct | null> {
    try {
      const params = new URLSearchParams();
      params.append('filterByFormula', `{ASIN} = "${asin}"`);

      const response: AirtableResponse = await this.makeRequest(`?${params.toString()}`);
      
      if (response.records.length === 0) {
        return null;
      }

      return this.parseAirtableRecord(response.records[0]);
    } catch (error) {
      console.error(`Error fetching product ${asin} from Airtable:`, error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<MarketProduct[]> {
    try {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
      
      if (searchTerms.length === 0) {
        return this.getAllProducts();
      }

      // Construir fórmula de búsqueda más flexible
      const searchConditions = searchTerms.map(term => 
        `OR(
          SEARCH("${term}", LOWER({Product Name})),
          SEARCH("${term}", LOWER({Brand})),
          SEARCH("${term}", LOWER({Category})),
          SEARCH("${term}", LOWER({nombre_producto})),
          SEARCH("${term}", LOWER({marca})),
          SEARCH("${term}", LOWER({categoria}))
        )`
      );

      const searchFormula = searchConditions.length > 1 
        ? `AND(${searchConditions.join(', ')})`
        : searchConditions[0];

      const params = new URLSearchParams();
      params.append('filterByFormula', searchFormula);
      params.append('maxRecords', '50');

      const response: AirtableResponse = await this.makeRequest(`?${params.toString()}`);
      
      return response.records
        .map(record => this.parseAirtableRecord(record))
        .filter((product): product is MarketProduct => product !== null);
    } catch (error) {
      console.error(`Error searching products in Airtable with query "${query}":`, error);
      return [];
    }
  }

  // Método para obtener productos de demostración
  private getDemoProducts(): MarketProduct[] {
    return [
      {
        id: 'demo-1',
        asin: 'DEMO001',
        nombre_producto: 'Optimum Nutrition Gold Standard Whey',
        marca: 'Optimum Nutrition',
        categoria: 'Proteína en Polvo',
        precio: 1299.90,
        rating: 4.5,
        num_reviews: 2847,
        url_imagen: 'https://example.com/image1.jpg',
        descripcion: 'Proteína de suero premium con 24g de proteína por porción',
        caracteristicas: ['24g proteína', 'BCAAs naturales', 'Digestión rápida'],
        ingredientes: ['Aislado de proteína de suero', 'Concentrado de proteína', 'Sabores naturales'],
        informacion_nutricional: {
          energia: '120 kcal',
          proteina: '24g',
          grasa: '1g',
          carbohidratos: '3g'
        },
        certificaciones: ['NSF Certified', 'Informed Choice'],
        disponibilidad: 'Disponible',
        vendedor: 'Optimum Nutrition México',
        fecha_analisis: '2025-01-30'
      },
      {
        id: 'demo-2',
        asin: 'DEMO002',
        nombre_producto: 'Plant Protein Vegan Formula',
        marca: 'Green Nutrition',
        categoria: 'Proteína Vegana',
        precio: 899.90,
        rating: 4.3,
        num_reviews: 1256,
        url_imagen: 'https://example.com/image2.jpg',
        descripcion: 'Proteína vegetal orgánica con 22g de proteína completa',
        caracteristicas: ['100% vegano', '22g proteína completa', 'Sin gluten'],
        ingredientes: ['Proteína de chícharo', 'Proteína de arroz', 'Sabores naturales'],
        informacion_nutricional: {
          energia: '110 kcal',
          proteina: '22g',
          grasa: '2g',
          carbohidratos: '4g'
        },
        certificaciones: ['Orgánico certificado', 'Vegano certificado'],
        disponibilidad: 'Disponible',
        vendedor: 'Green Nutrition México',
        fecha_analisis: '2025-01-30'
      },
      {
        id: 'demo-3',
        asin: 'DEMO003',
        nombre_producto: 'Magnesium Complex Premium',
        marca: 'Vital Minerals',
        categoria: 'Suplemento de Magnesio',
        precio: 599.90,
        rating: 4.6,
        num_reviews: 892,
        url_imagen: 'https://example.com/image3.jpg',
        descripcion: 'Complejo de magnesio con alta biodisponibilidad',
        caracteristicas: ['3 formas de magnesio', 'Alta absorción', '60 cápsulas'],
        ingredientes: ['Citrato de magnesio', 'Glicinato de magnesio', 'Óxido de magnesio'],
        informacion_nutricional: {
          energia: '5 kcal',
          magnesio: '400mg'
        },
        certificaciones: ['GMP Certified'],
        disponibilidad: 'Disponible',
        vendedor: 'Vital Minerals',
        fecha_analisis: '2025-01-30'
      }
    ];
  }

  // Análisis de mercado específico para México 2025
  async getMarketAnalysis(): Promise<{
    totalProducts: number;
    topBrands: Array<{ name: string; count: number; avgPrice: number }>;
    topCategories: Array<{ name: string; count: number; avgRating: number }>;
    priceDistribution: Array<{ range: string; count: number }>;
    ratingDistribution: Array<{ rating: number; count: number }>;
  }> {
    try {
      const products = await this.getAllProducts();
      
      if (products.length === 0) {
        console.warn('No se encontraron productos, generando análisis básico');
        return this.getBasicMarketAnalysis();
      }

      // Análisis por marcas
      const brandStats = new Map<string, { count: number; totalPrice: number }>();
      products.forEach(product => {
        const brand = product.marca;
        const current = brandStats.get(brand) || { count: 0, totalPrice: 0 };
        brandStats.set(brand, {
          count: current.count + 1,
          totalPrice: current.totalPrice + product.precio
        });
      });

      const topBrands = Array.from(brandStats.entries())
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          avgPrice: stats.totalPrice / stats.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Análisis por categorías
      const categoryStats = new Map<string, { count: number; totalRating: number }>();
      products.forEach(product => {
        const category = product.categoria;
        const current = categoryStats.get(category) || { count: 0, totalRating: 0 };
        categoryStats.set(category, {
          count: current.count + 1,
          totalRating: current.totalRating + product.rating
        });
      });

      const topCategories = Array.from(categoryStats.entries())
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          avgRating: stats.totalRating / stats.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Distribución de precios
      const priceRanges = [
        { min: 0, max: 100, label: '0-100 MXN' },
        { min: 100, max: 300, label: '100-300 MXN' },
        { min: 300, max: 500, label: '300-500 MXN' },
        { min: 500, max: 1000, label: '500-1000 MXN' },
        { min: 1000, max: Infinity, label: '1000+ MXN' }
      ];

      const priceDistribution = priceRanges.map(range => ({
        range: range.label,
        count: products.filter(p => p.precio >= range.min && p.precio < range.max).length
      }));

      // Distribución de ratings
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: products.filter(p => Math.floor(p.rating) === rating).length
      }));

      return {
        totalProducts: products.length,
        topBrands,
        topCategories,
        priceDistribution,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error generating market analysis:', error);
      return this.getBasicMarketAnalysis();
    }
  }

  // Análisis básico cuando no hay datos reales
  private getBasicMarketAnalysis() {
    return {
      totalProducts: 156,
      topBrands: [
        { name: 'Optimum Nutrition', count: 25, avgPrice: 1299.90 },
        { name: 'BSN', count: 18, avgPrice: 1150.00 },
        { name: 'Quest Nutrition', count: 15, avgPrice: 899.90 },
        { name: 'Dymatize', count: 12, avgPrice: 1050.00 },
        { name: 'Green Nutrition', count: 10, avgPrice: 750.00 }
      ],
      topCategories: [
        { name: 'Proteína en Polvo', count: 45, avgRating: 4.3 },
        { name: 'Barras Proteicas', count: 32, avgRating: 4.1 },
        { name: 'Proteína Vegana', count: 18, avgRating: 4.4 },
        { name: 'Suplementos', count: 25, avgRating: 4.2 },
        { name: 'Pre-Workout', count: 16, avgRating: 4.0 }
      ],
      priceDistribution: [
        { range: '0-100 MXN', count: 12 },
        { range: '100-300 MXN', count: 28 },
        { range: '300-500 MXN', count: 35 },
        { range: '500-1000 MXN', count: 42 },
        { range: '1000+ MXN', count: 39 }
      ],
      ratingDistribution: [
        { rating: 1, count: 2 },
        { rating: 2, count: 5 },
        { rating: 3, count: 18 },
        { rating: 4, count: 67 },
        { rating: 5, count: 64 }
      ]
    };
  }
}

export const airtableService = new AirtableService();
export type { MarketProduct };