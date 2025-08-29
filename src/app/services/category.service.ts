import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ContextService } from './context.service';
import { Category, CategoryFilter, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService {
  private contextService = inject(ContextService);

  /**
   * Get all categories for the current company
   */
  getCategories(): Observable<Category[]> {
    const companyId = this.contextService.getCompanyId();
    return this.get<Category[]>('/categories/list.php', { company_id: companyId });
  }

  /**
   * Get all categories for a specific company
   */
  getCategoriesForCompany(companyId: number): Observable<Category[]> {
    return this.get<Category[]>('/categories/list.php', { company_id: companyId });
  }

  /**
   * Get a specific category by ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.get<Category>('/categories/get.php', { id });
  }

  /**
   * Get featured categories for the current company
   */
  getFeaturedCategories(): Observable<Category[]> {
    const companyId = this.contextService.getCompanyId();
    return this.get<Category[]>('/categories/featured.php', { company_id: companyId });
  }

  /**
   * Get featured categories for a specific company
   */
  getFeaturedCategoriesForCompany(companyId: number): Observable<Category[]> {
    return this.get<Category[]>('/categories/featured.php', { company_id: companyId });
  }

  /**
   * Get root categories (categories without parent) for the current company
   */
  getRootCategories(): Observable<Category[]> {
    const companyId = this.contextService.getCompanyId();
    return this.get<Category[]>('/categories/root.php', { company_id: companyId });
  }

  /**
   * Get root categories for a specific company
   */
  getRootCategoriesForCompany(companyId: number): Observable<Category[]> {
    return this.get<Category[]>('/categories/root.php', { company_id: companyId });
  }

  /**
   * Create a new category for the current company
   */
  createCategory(category: Partial<Category>): Observable<ApiResponse<Category>> {
    const companyId = this.contextService.getCompanyId();
    const categoryData = {
      ...category,
      company_id: companyId
    };
    return this.post<ApiResponse<Category>>('/categories/save.php', categoryData);
  }

  /**
   * Update an existing category
   */
  updateCategory(category: Category): Observable<ApiResponse<Category>> {
    return this.post<ApiResponse<Category>>('/categories/save.php', category);
  }

  /**
   * Delete a category
   */
  deleteCategory(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/categories/delete.php', { id });
  }

  /**
   * Toggle category featured status
   */
  toggleFeatured(id: number, featured: boolean): Observable<ApiResponse<Category>> {
    return this.post<ApiResponse<Category>>('/categories/save.php', {
      id,
      featured: featured ? 1 : 0
    });
  }

  /**
   * Get categories by parent ID for the current company
   */
  getCategoriesByParent(parentId: number): Observable<Category[]> {
    const companyId = this.contextService.getCompanyId();
    return this.get<Category[]>('/categories/list.php', {
      company_id: companyId,
      parent_id: parentId
    });
  }

  /**
   * Search categories by name for the current company
   */
  searchCategories(query: string): Observable<Category[]> {
    const companyId = this.contextService.getCompanyId();
    return this.get<Category[]>('/categories/list.php', {
      company_id: companyId,
      search: query
    });
  }
}
