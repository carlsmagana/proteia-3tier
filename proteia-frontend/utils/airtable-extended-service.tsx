import { AIRTABLE_CONFIG, AIRTABLE_TABLES, getAirtableUrl } from './airtable-config';

// Tipos para las diferentes tablas
export interface NutritionalInfo {
  id: string;
  product_id?: string;
  product_name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: string[];
  minerals?: string[];
  serving_size?: string;
  servings_per_container?: number;
}

export interface KeyBenefit {
  id: string;
  product_id?: string;
  product_name?: string;
  benefit_category?: string;
  primary_benefit?: string;
  secondary_benefits?: string[];
  clinical_evidence?: string;
  target_audience?: string;
  efficacy_rating?: number;
}

export interface ClaimExclusion {
  id: string;
  product_id?: string;
  product_name?: string;
  approved_claims?: string[];
  restricted_claims?: string[];
  health_claims?: string[];
  structure_function_claims?: string[];
  regulatory_notes?: string;
  compliance_status?: string;
}

export interface KeyIngredient {
  id: string;
  product_id?: string;
  product_name?: string;
  ingredient_name?: string;
  ingredient_type?: string;
  concentration?: string;
  source?: string;
  function?: string;
  allergen_info?: string;
  organic_certified?: boolean;
  non_gmo?: boolean;
}

export interface DesignColor {
  id: string;
  product_id?: string;
  product_name?: string;
  primary_color?: string;
  secondary_colors?: string[];
  accent_colors?: string[];
  brand_colors?: string[];
  color_psychology?: string;
  market_appeal?: string;
}

export interface Certification {
  id: string;
  product_id?: string;
  product_name?: string;
  certification_type?: string;
  certifying_body?: string;
  certification_number?: string;
  expiry_date?: string;
  scope?: string;
  logo_available?: boolean;
  market_value?: string;
}

class AirtableExtendedService {
  private async makeRequest(tableName: string, endpoint: string = ''): Promise<any> {
    const url = getAirtableUrl(tableName, endpoint);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('API Key de Airtable inválido o expirado.');
      } else if (response.status === 404) {
        throw new Error(`Tabla "${tableName}" no encontrada en la base.`);
      } else if (response.status === 403) {
        throw new Error(`Permisos insuficientes para acceder a la tabla "${tableName}".`);
      } else {
        throw new Error(`Error HTTP ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
      }
    }

    return response.json();
  }

  private parseGenericRecord(record: any): any {
    const fields = record.fields || {};
    return {
      id: record.id,
      ...fields
    };
  }

  // Obtener información nutricional
  async getNutritionalInfo(productId?: string): Promise<NutritionalInfo[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.NUTRITIONAL_INFO);
      const records = response.records || [];
      
      let nutritionalData = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        nutritionalData = nutritionalData.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return nutritionalData;
    } catch (error) {
      console.warn('Error fetching nutritional info:', error);
      return this.getDemoNutritionalInfo();
    }
  }

  // Obtener beneficios clave
  async getKeyBenefits(productId?: string): Promise<KeyBenefit[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.KEY_BENEFITS);
      const records = response.records || [];
      
      let benefits = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        benefits = benefits.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return benefits;
    } catch (error) {
      console.warn('Error fetching key benefits:', error);
      return this.getDemoKeyBenefits();
    }
  }

  // Obtener claims y exclusiones
  async getClaimsExclusions(productId?: string): Promise<ClaimExclusion[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.CLAIMS_EXCLUSIONS);
      const records = response.records || [];
      
      let claims = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        claims = claims.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return claims;
    } catch (error) {
      console.warn('Error fetching claims & exclusions:', error);
      return this.getDemoClaimsExclusions();
    }
  }

  // Obtener ingredientes clave
  async getKeyIngredients(productId?: string): Promise<KeyIngredient[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.KEY_INGREDIENTS);
      const records = response.records || [];
      
      let ingredients = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        ingredients = ingredients.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return ingredients;
    } catch (error) {
      console.warn('Error fetching key ingredients:', error);
      return this.getDemoKeyIngredients();
    }
  }

  // Obtener colores de diseño
  async getDesignColors(productId?: string): Promise<DesignColor[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.DESIGN_COLORS);
      const records = response.records || [];
      
      let colors = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        colors = colors.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return colors;
    } catch (error) {
      console.warn('Error fetching design colors:', error);
      return this.getDemoDesignColors();
    }
  }

  // Obtener certificaciones
  async getCertifications(productId?: string): Promise<Certification[]> {
    try {
      const response = await this.makeRequest(AIRTABLE_TABLES.CERTIFICATIONS);
      const records = response.records || [];
      
      let certifications = records.map((record: any) => this.parseGenericRecord(record));
      
      if (productId) {
        certifications = certifications.filter((item: any) => 
          item.product_id === productId || item.product_name?.includes(productId)
        );
      }
      
      return certifications;
    } catch (error) {
      console.warn('Error fetching certifications:', error);
      return this.getDemoCertifications();
    }
  }

  // Obtener análisis completo de producto
  async getCompleteProductAnalysis(productId: string) {
    const [nutritional, benefits, claims, ingredients, colors, certifications] = await Promise.all([
      this.getNutritionalInfo(productId),
      this.getKeyBenefits(productId),
      this.getClaimsExclusions(productId),
      this.getKeyIngredients(productId),
      this.getDesignColors(productId),
      this.getCertifications(productId)
    ]);

    return {
      nutritional,
      benefits,
      claims,
      ingredients,
      colors,
      certifications
    };
  }

  // Métodos para datos de demostración
  private getDemoNutritionalInfo(): NutritionalInfo[] {
    return [
      {
        id: 'demo-nut-1',
        product_name: 'Proteo50',
        calories: 120,
        protein: 24,
        carbs: 3,
        fat: 1,
        fiber: 0,
        sugar: 2,
        sodium: 150,
        vitamins: ['B6', 'B12', 'C'],
        minerals: ['Calcio', 'Hierro', 'Zinc'],
        serving_size: '30g',
        servings_per_container: 30
      }
    ];
  }

  private getDemoKeyBenefits(): KeyBenefit[] {
    return [
      {
        id: 'demo-ben-1',
        product_name: 'Proteo50',
        benefit_category: 'Músculo y Fuerza',
        primary_benefit: 'Desarrollo muscular magro',
        secondary_benefits: ['Recuperación post-ejercicio', 'Saciedad'],
        clinical_evidence: 'Estudios clínicos demuestran aumento del 25% en síntesis proteica',
        target_audience: 'Atletas y personas activas',
        efficacy_rating: 9
      }
    ];
  }

  private getDemoClaimsExclusions(): ClaimExclusion[] {
    return [
      {
        id: 'demo-claim-1',
        product_name: 'Proteo50',
        approved_claims: ['Contribuye al desarrollo muscular', 'Fuente de proteína completa'],
        restricted_claims: ['Cura enfermedades', 'Garantiza pérdida de peso'],
        health_claims: ['Mantiene músculos saludables'],
        structure_function_claims: ['Apoya la función muscular normal'],
        regulatory_notes: 'Cumple con regulaciones COFEPRIS',
        compliance_status: 'Aprobado'
      }
    ];
  }

  private getDemoKeyIngredients(): KeyIngredient[] {
    return [
      {
        id: 'demo-ing-1',
        product_name: 'Proteo50',
        ingredient_name: 'Aislado de Proteína de Suero',
        ingredient_type: 'Proteína',
        concentration: '90%',
        source: 'Leche de vaca',
        function: 'Construcción muscular',
        allergen_info: 'Contiene lácteos',
        organic_certified: false,
        non_gmo: true
      }
    ];
  }

  private getDemoDesignColors(): DesignColor[] {
    return [
      {
        id: 'demo-color-1',
        product_name: 'Proteo50',
        primary_color: '#1B365D',
        secondary_colors: ['#FFFFFF', '#F5F5F5'],
        accent_colors: ['#FF6B35', '#4ECDC4'],
        brand_colors: ['#1B365D', '#FF6B35'],
        color_psychology: 'Confianza, pureza, energía',
        market_appeal: 'Atrae a consumidores premium y deportistas'
      }
    ];
  }

  private getDemoCertifications(): Certification[] {
    return [
      {
        id: 'demo-cert-1',
        product_name: 'Proteo50',
        certification_type: 'NSF Certified for Sport',
        certifying_body: 'NSF International',
        certification_number: 'NSF-2025-001',
        expiry_date: '2025-12-31',
        scope: 'Suplementos deportivos',
        logo_available: true,
        market_value: 'Alto - Incrementa confianza del consumidor en 40%'
      }
    ];
  }

  // Verificar estado de configuración para todas las tablas
  async checkAllTablesAccess(): Promise<{
    accessible: string[];
    inaccessible: string[];
    errors: Record<string, string>;
  }> {
    const tables = Object.values(AIRTABLE_TABLES);
    const accessible: string[] = [];
    const inaccessible: string[] = [];
    const errors: Record<string, string> = {};

    for (const table of tables) {
      try {
        await this.makeRequest(table, '?maxRecords=1');
        accessible.push(table);
      } catch (error) {
        inaccessible.push(table);
        errors[table] = error instanceof Error ? error.message : 'Error desconocido';
      }
    }

    return { accessible, inaccessible, errors };
  }
}

export const airtableExtendedService = new AirtableExtendedService();