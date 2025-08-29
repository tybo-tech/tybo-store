import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Product, ProductFilter, ProductSearchParams, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService {

  /**
   * Get all products with optional filters
   */
  getProducts(filter: ProductFilter): Observable<Product[]> {
    const params: any = { company_id: filter.company_id };

    if (filter.featured !== undefined) params.featured = filter.featured ? 1 : 0;
    if (filter.on_sale !== undefined) params.on_sale = filter.on_sale ? 1 : 0;
    if (filter.category_id) params.category_id = filter.category_id;

    return this.get<Product[]>('/products/list.php', params);
  }

  /**
   * Get a specific product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.get<Product>('/products/get.php', { id });
  }

  /**
   * Search products by query string
   */
  searchProducts(searchParams: ProductSearchParams): Observable<Product[]> {
    return this.get<Product[]>('/products/search.php', {
      query: searchParams.query,
      company_id: searchParams.company_id
    });
  }

  /**
   * Get latest products
   */
  getLatestProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products/latest.php');
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(companyId: number): Observable<Product[]> {
    return this.getProducts({ company_id: companyId, featured: true });
  }

  /**
   * Get products on sale
   */
  getSaleProducts(companyId: number): Observable<Product[]> {
    return this.getProducts({ company_id: companyId, on_sale: true });
  }

  /**
   * Get products by category
   */
  getProductsByCategory(companyId: number, categoryId: number): Observable<Product[]> {
    return this.getProducts({ company_id: companyId, category_id: categoryId });
  }

  /**
   * Create a new product
   */
  createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.post<ApiResponse<Product>>('/products/add.php', product);
  }

  /**
   * Create multiple products
   */
  createProducts(products: Partial<Product>[]): Observable<ApiResponse<Product[]>> {
    return this.post<ApiResponse<Product[]>>('/products/add-many.php', { products });
  }

  /**
   * Update an existing product
   */
  updateProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.put<ApiResponse<Product>>('/products/update.php', product);
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/products/delete.php', { id });
  }

  /**
   * Filter products with advanced criteria
   */
  filterProducts(filter: ProductFilter): Observable<Product[]> {
    return this.get<Product[]>('/products/filter.php', filter);
  }

  /**
   * Get detailed product view
   */
  getProductView(id: number): Observable<Product> {
    return this.get<Product>('/products/view.php', { id });
  }

  /**
   * Import products
   */
  importProducts(data: any): Observable<ApiResponse> {
    return this.post<ApiResponse>('/products/import.php', data);
  }
}
