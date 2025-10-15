// Configuración de Airtable - usando variables de entorno
export const AIRTABLE_CONFIG = {
  API_KEY: process.env.VITE_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY_HERE",
  BASE_ID: process.env.VITE_AIRTABLE_BASE_ID || "appbElV8Iam12ncFz",
  BASE_URL: "https://api.airtable.com/v0",
};

// Configuración de todas las tablas disponibles
export const AIRTABLE_TABLES = {
  MAIN_PRODUCTS: "Proteia",
  NUTRITIONAL_INFO: "Nutritional Information",
  KEY_BENEFITS: "Key Benefits",
  CLAIMS_EXCLUSIONS: "Claims & Exclusions",
  KEY_INGREDIENTS: "Key Ingredients",
  DESIGN_COLORS: "Design Colors",
  CERTIFICATIONS: "Certifications & Labels"
} as const;

export const getAirtableUrl = (tableName: string = AIRTABLE_TABLES.MAIN_PRODUCTS, endpoint: string = "") => {
  return `${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}${endpoint}`;
};