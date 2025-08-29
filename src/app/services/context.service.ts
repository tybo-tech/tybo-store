import { Injectable, signal, computed } from '@angular/core';
import { BaseApiService } from './base-api.service';

export interface Company {
  id: number;
  slug: string;
  name: string;
  logo: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  address_url: string;
  created_at: string;
  owner_id: string;
  metadata: CompanyMetadata;
  email: string;
  phone: string;
  twitter: string;
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface CompanyMetadata {
  logos: any[];
  pages: CompanyPage[];
  images: any[];
  webUrl: string;
  navType: string;
  bannerBg: string;
  currency: string;
  metaTags: MetaTags;
  whatsapp: string;
  useWeight: string;
  varations: any[];
  enableYoco: boolean;
  isMigrated: boolean;
  logoSizePc: number;
  showBanner: boolean;
  bannerColor: string;
  orderPrefix: string;
  themeColors: ThemeColor[];
  deliveryFees: DeliveryFee[];
  noReplyEmail: string;
  bannerMessage: string;
  enablePayfast: boolean;
  enableDemoMode: boolean;
  logoSizeMobile: number;
  processingTime: string;
  cashTransferBank: string;
  deliveryFeesTypes: DeliveryFeeType[];
  payFastMerchantId: string;
  cashTransferBranch: string;
  enableCashTransfer: boolean;
  payFastMerchantKey: string;
  yocoPaymentKeyLive: string;
  cashTransferAccount: string;
  enableProcessingTime: boolean;
  yocoPaymentKeySandBox: string;
  cashTransferAccountName: string;
  cashTransferAccountType: string;
}

export interface CompanyPage {
  id: string;
  link: string;
  name: string;
  sections: any[];
  showOnNav: string;
}

export interface MetaTags {
  title: string;
  author: string;
  og_url: string;
  robots: string;
  favicon: string;
  og_type: string;
  keywords: string;
  manifest: string;
  og_image: string;
  og_title: string;
  canonical: string;
  description: string;
  theme_color: string;
  twitter_card: string;
  twitter_image: string;
  twitter_title: string;
  og_description: string;
  twitter_description: string;
}

export interface ThemeColor {
  name: string;
  value: string;
  variable: string;
}

export interface DeliveryFee {
  max: number;
  min: number;
  value: number;
}

export interface DeliveryFeeType {
  id: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContextService extends BaseApiService {
  // Current company context - for now hardcoded to company ID 2
  private _currentCompanyId = signal<number>(2);
  private _currentCompany = signal<Company | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  currentCompanyId = this._currentCompanyId.asReadonly();
  currentCompany = this._currentCompany.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Computed properties for easy access
  companyMetadata = computed(() => this._currentCompany()?.metadata);
  companyPages = computed(() => this._currentCompany()?.metadata?.pages || []);
  themeColors = computed(() => this._currentCompany()?.metadata?.themeColors || []);
  webUrl = computed(() => this._currentCompany()?.metadata?.webUrl);
  currency = computed(() => this._currentCompany()?.metadata?.currency || 'ZAR');

  constructor() {
    super();
    // Load company data on service initialization
    this.loadCurrentCompany();

    // Temporary fallback data for testing
    setTimeout(() => {
      if (!this._currentCompany()) {
        console.log('ContextService - Using fallback company data');
        const fallbackCompany: Company = {
          "id": 2,
          "slug": "mayandaempire",
          "name": "Mayanda Empire",
          "logo": "https://store.tybo.co.za/api/api/upload/uploads/1749491807Image.png",
          "description": "",
          "address": "The South",
          "latitude": "-22.983426",
          "longitude": "30.462617",
          "address_url": "https://maps.google.com/?cid=18397882146114513953",
          "created_at": "2024-01-16 11:21:17",
          "owner_id": "54",
          "metadata": {
            "logos": [],
            "pages": [
              {
                "id": "home",
                "link": "/",
                "name": "Home",
                "sections": [],
                "showOnNav": "Yes"
              },
              {
                "id": "contact-us",
                "link": "/home/contact-us",
                "name": "Contact Us",
                "sections": [],
                "showOnNav": "Yes"
              },
              {
                "id": "account",
                "link": "/home/login",
                "name": "Account",
                "sections": [],
                "showOnNav": "Yes"
              },
              {
                "id": "products",
                "link": "/home/products",
                "name": "Products",
                "sections": [],
                "showOnNav": "Yes"
              },
              {
                "id": "checkout",
                "link": "/home/checkout",
                "name": "Checkout",
                "sections": [],
                "showOnNav": "Yes"
              }
            ],
            "images": [],
            "webUrl": "https://viviid.co.za",
            "navType": "default",
            "bannerBg": "#a78141",
            "currency": "ZAR ",
            "metaTags": {
              "title": "We bake",
              "author": "Mayanda Empire",
              "og_url": "https://viviid.co.za",
              "robots": "index, follow",
              "favicon": "favicon.ico",
              "og_type": "website",
              "keywords": "",
              "manifest": "manifest.webmanifest",
              "og_image": "",
              "og_title": "Mayanda Empire",
              "canonical": "https://viviid.co.za",
              "description": "Discover WeBake – your go-to destination for handcrafted, joy-filled treats.",
              "theme_color": "#a38245",
              "twitter_card": "summary_large_image",
              "twitter_image": "",
              "twitter_title": "Mayanda Empire",
              "og_description": "Discover WeBake – your go-to destination for handcrafted, joy-filled treats.",
              "twitter_description": "Discover WeBake – your go-to destination for handcrafted, joy-filled treats."
            },
            "whatsapp": "+27761624486",
            "useWeight": "No",
            "varations": [],
            "enableYoco": false,
            "isMigrated": true,
            "logoSizePc": 7,
            "showBanner": true,
            "bannerColor": "#ffffff",
            "orderPrefix": "ORD-",
            "themeColors": [
              {
                "name": "Background Color",
                "value": "#ffffff",
                "variable": "--color-background"
              },
              {
                "name": "Surface Color",
                "value": "#ffffff",
                "variable": "--color-surface"
              },
              {
                "name": "Border Color",
                "value": "#dcdcdc",
                "variable": "--color-border"
              },
              {
                "name": "Text Color",
                "value": "#5e5e5e",
                "variable": "--color-text"
              },
              {
                "name": "Primary Color",
                "value": "#a38245",
                "variable": "--color-primary"
              }
            ],
            "deliveryFees": [],
            "noReplyEmail": "no-reply@viviid.co.za",
            "bannerMessage": " ⚽ Free nationwide delivery on all orders over R1,000! | Authentic. Local. Yours. ",
            "enablePayfast": true,
            "enableDemoMode": true,
            "logoSizeMobile": 5,
            "processingTime": "Your order will be processed upon verification of the payment.",
            "cashTransferBank": "FNB",
            "deliveryFeesTypes": [],
            "payFastMerchantId": "17194710",
            "cashTransferBranch": "470010",
            "enableCashTransfer": true,
            "payFastMerchantKey": "tqcl4iesooa66",
            "yocoPaymentKeyLive": "xxxxx",
            "cashTransferAccount": "00000000",
            "enableProcessingTime": true,
            "yocoPaymentKeySandBox": "xxxxxxxx",
            "cashTransferAccountName": "viviid",
            "cashTransferAccountType": "Savings"
          },
          "email": "info@viviid.co.za",
          "phone": "+27761624486",
          "twitter": "",
          "facebook": "https://www.facebook.com/profile.php?id=61551844396365",
          "instagram": "",
          "tiktok": ""
        };

        this._currentCompany.set(fallbackCompany);
        this.applyThemeColors(fallbackCompany.metadata?.themeColors || []);
      }
    }, 5000);
  }

  /**
   * Get the current company ID - main method requested
   */
  getCompanyId(): number {
    return this._currentCompanyId();
  }

  /**
   * Load company data for the current company ID
   */
  async loadCurrentCompany(): Promise<void> {
    console.log('ContextService - Loading company ID:', this._currentCompanyId());
    this._isLoading.set(true);
    this._error.set(null);

    try {
      // Try multiple endpoint patterns
      const endpoints = [
        `/companies/get.php?id=${this._currentCompanyId()}`,
        `/companies/get.php?company_id=${this._currentCompanyId()}`,
        `/collection-data/get.php?company_id=${this._currentCompanyId()}&collection=companies&id=${this._currentCompanyId()}`,
        `/collection-data/get-by-parent.php?parentId=companies&collectionId=company&company_id=${this._currentCompanyId()}`
      ];

      let response = null;
      let successfulEndpoint = '';

      for (const endpoint of endpoints) {
        try {
          console.log('ContextService - Trying endpoint:', `${this.baseUrl}${endpoint}`);
          response = await this.get<any>(endpoint).toPromise();
          
          if (response && (response.success !== false) && (response.data || response.id || response.name)) {
            successfulEndpoint = endpoint;
            console.log('ContextService - Successful endpoint:', successfulEndpoint);
            break;
          }
        } catch (endpointError) {
          console.log('ContextService - Endpoint failed:', endpoint, endpointError);
          continue;
        }
      }

      console.log('ContextService - API Response:', response);

      if (response && (response.success !== false) && (response.data || response.id || response.name)) {
        // Handle different response formats
        const companyData = response.data || response;
        console.log('ContextService - Company loaded successfully:', companyData);
        this._currentCompany.set(companyData);
        this.applyThemeColors(companyData.metadata?.themeColors || []);
      } else {
        console.error('ContextService - All endpoints failed or returned no data');
        this._error.set('No company data found from any endpoint');
      }
    } catch (error) {
      console.error('ContextService - Error loading company:', error);
      this._error.set('Error loading company data: ' + (error as any)?.message);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Switch to a different company context
   */
  async switchCompany(companyId: number): Promise<void> {
    this._currentCompanyId.set(companyId);
    await this.loadCurrentCompany();
  }

  /**
   * Get a specific page configuration from company metadata
   */
  getPageConfig(pageId: string): CompanyPage | undefined {
    return this.companyPages().find(page => page.id === pageId);
  }

  /**
   * Get navigation pages (pages that should show in navigation)
   */
  getNavigationPages(): CompanyPage[] {
    return this.companyPages().filter(page => page.showOnNav === 'Yes');
  }

  /**
   * Apply theme colors to CSS custom properties
   */
  private applyThemeColors(themeColors: ThemeColor[]): void {
    const root = document.documentElement;

    themeColors.forEach(color => {
      if (color.variable && color.value) {
        root.style.setProperty(color.variable, color.value);
      }
    });
  }

  /**
   * Get theme color by variable name
   */
  getThemeColor(variable: string): string | undefined {
    const color = this.themeColors().find(c => c.variable === variable);
    return color?.value;
  }

  /**
   * Get delivery fee types for current company
   */
  getDeliveryFeeTypes(): DeliveryFeeType[] {
    return this.companyMetadata()?.deliveryFeesTypes || [];
  }

  /**
   * Check if a feature is enabled for current company
   */
  isFeatureEnabled(feature: keyof CompanyMetadata): boolean {
    const metadata = this.companyMetadata();
    if (!metadata) return false;

    return Boolean(metadata[feature]);
  }

  /**
   * Get company contact information
   */
  getContactInfo() {
    const company = this._currentCompany();
    if (!company) return null;

    return {
      email: company.email,
      phone: company.phone,
      whatsapp: company.metadata?.whatsapp,
      address: company.address,
      social: {
        facebook: company.facebook,
        instagram: company.instagram,
        twitter: company.twitter,
        tiktok: company.tiktok
      }
    };
  }

  /**
   * Get payment configuration
   */
  getPaymentConfig() {
    const metadata = this.companyMetadata();
    if (!metadata) return null;

    return {
      enableYoco: metadata.enableYoco,
      enablePayfast: metadata.enablePayfast,
      enableCashTransfer: metadata.enableCashTransfer,
      yocoKeyLive: metadata.yocoPaymentKeyLive,
      yocoKeySandbox: metadata.yocoPaymentKeySandBox,
      payfastMerchantId: metadata.payFastMerchantId,
      payfastMerchantKey: metadata.payFastMerchantKey,
      cashTransfer: {
        bank: metadata.cashTransferBank,
        branch: metadata.cashTransferBranch,
        account: metadata.cashTransferAccount,
        accountName: metadata.cashTransferAccountName,
        accountType: metadata.cashTransferAccountType
      }
    };
  }
}
