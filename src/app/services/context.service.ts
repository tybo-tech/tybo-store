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
  // Current company context - for now hardcoded to company ID 1
  private _currentCompanyId = signal<number>(1);
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
