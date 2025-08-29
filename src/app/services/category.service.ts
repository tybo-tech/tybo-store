import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Category, CategoryFilter, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService {

  /**
   * Get all categories for a company
   */
  getCategories(companyId: number): Observable<Category[]> {
    return this.get<Category[]>('/categories/list.php', { company_id: companyId });
  }

  /**
   * Get a specific category by ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.get<Category>('/categories/get.php', { id });
  }

  /**
   * Get featured categories
   */
  getFeaturedCategories(): Observable<Category[]> {
    return this.get<Category[]>('/categories/featured.php');
  }

  /**
   * Get root categories (categories without parent)
   */
  getRootCategories(): Observable<Category[]> {
    return this.get<Category[]>('/categories/root.php');
  }

  /**
   * Create a new category
   */
  createCategory(category: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.post<ApiResponse<Category>>('/categories/save.php', category);
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
}
