import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Website,
  WebsitePage,
  WebsitePageData,
  PageData,
  PageSection,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService extends BaseApiService {

  // Website Management
  /**
   * Get website by ID
   */
  getWebsite(websiteId: number): Observable<Website> {
    return this.get<Website>('/tybo/get-website.php', { website_id: websiteId });
  }

  /**
   * Create a new website
   */
  createWebsite(website: Partial<Website>): Observable<ApiResponse<Website>> {
    return this.post<ApiResponse<Website>>('/tybo/add-website.php', website);
  }

  /**
   * Update website
   */
  updateWebsite(website: Website): Observable<ApiResponse<Website>> {
    return this.post<ApiResponse<Website>>('/tybo/update-website.php', website);
  }

  /**
   * Initialize website
   */
  initializeWebsite(data: any): Observable<ApiResponse> {
    return this.post<ApiResponse>('/tybo/init.php', data);
  }

  // Page Management
  /**
   * Get page data by collection and parent
   */
  getPageData(collection: string, parentId: string): Observable<WebsitePageData[]> {
    return this.get<WebsitePageData[]>('/collection-data/list.php', {
      collection,
      parent_id: parentId
    });
  }

  /**
   * Get page data by ID
   */
  getPageDataById(id: number): Observable<WebsitePageData> {
    return this.get<WebsitePageData>('/collection-data/get.php', { id });
  }

  /**
   * Save page data
   */
  savePageData(pageData: Partial<WebsitePageData>): Observable<ApiResponse<WebsitePageData>> {
    return this.post<ApiResponse<WebsitePageData>>('/collection-data/save.php', pageData);
  }

  /**
   * Create a new page
   */
  createPage(page: Partial<WebsitePage>): Observable<ApiResponse<WebsitePage>> {
    return this.post<ApiResponse<WebsitePage>>('/tybo/add-page.php', page);
  }

  /**
   * Update page
   */
  updatePage(page: WebsitePage): Observable<ApiResponse<WebsitePage>> {
    return this.post<ApiResponse<WebsitePage>>('/tybo/update-page.php', page);
  }

  /**
   * Delete page
   */
  deletePage(pageId: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/tybo/delete-page.php', { page_id: pageId });
  }

  // Section Management
  /**
   * Add section to page
   */
  addSection(section: PageSection): Observable<ApiResponse<PageSection>> {
    return this.post<ApiResponse<PageSection>>('/tybo/add-section.php', section);
  }

  /**
   * Update page sections
   */
  updateSections(pageId: string, sections: PageSection[]): Observable<ApiResponse> {
    return this.post<ApiResponse>('/tybo/update-sections.php', {
      pageId,
      sections
    });
  }

  /**
   * Delete section
   */
  deleteSection(sectionId: string): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/tybo/delete-section.php', { section_id: sectionId });
  }

  // Helper methods for the website builder
  /**
   * Get home page data
   */
  getHomePageData(companyId: number): Observable<WebsitePageData[]> {
    return this.getPageData('page', 'home');
  }

  /**
   * Create a new section with default structure
   */
  createDefaultSection(type: string, pageId: string): PageSection {
    const sectionId = `section-${this.generateUUID()}`;

    return {
      id: sectionId,
      type,
      image: `${type}.png`,
      pageId,
      styles: {
        pc: {
          width: '100%',
          padding: '60px 20px',
          'background-color': '#f3f4f6'
        },
        mobile: {
          padding: '30px 12px'
        },
        tablet: {
          padding: '40px 16px'
        }
      },
      container: {
        id: `el-${this.generateUUID()}`,
        tag: 'div',
        styles: {
          pc: {
            margin: '0 auto',
            padding: '60px 20px',
            'max-width': '1200px'
          },
          mobile: {
            padding: '30px 12px'
          },
          tablet: {
            padding: '40px 16px'
          }
        },
        children: []
      }
    };
  }

  /**
   * Generate UUID for new elements
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Validate page structure
   */
  validatePageData(pageData: PageData): boolean {
    if (!pageData.sections || !Array.isArray(pageData.sections)) {
      return false;
    }

    return pageData.sections.every(section =>
      section.id &&
      section.type &&
      section.container &&
      section.container.children
    );
  }

  /**
   * Get available section types
   */
  getAvailableSectionTypes(): string[] {
    return [
      'hero-slider',
      'nine-grid-category',
      'feature-intro1',
      'category-with-products',
      'text-content',
      'image-gallery',
      'contact-form',
      'testimonials',
      'footer'
    ];
  }
}
