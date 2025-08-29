import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Variation, VariationOption, ItemVariation, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VariationService extends BaseApiService {

  // Variation methods
  /**
   * Get all variations for a company
   */
  getVariations(companyId: number): Observable<ApiResponse<Variation[]>> {
    return this.get<ApiResponse<Variation[]>>('/variations/list.php', { company_id: companyId });
  }

  /**
   * Get a specific variation by ID
   */
  getVariationById(id: number): Observable<Variation> {
    return this.get<Variation>('/variations/get.php', { id });
  }

  /**
   * Create a new variation
   */
  createVariation(variation: Partial<Variation>): Observable<ApiResponse<Variation>> {
    return this.post<ApiResponse<Variation>>('/variations/add.php', variation);
  }

  /**
   * Update an existing variation
   */
  updateVariation(variation: Variation): Observable<ApiResponse<Variation>> {
    return this.put<ApiResponse<Variation>>('/variations/update.php', variation);
  }

  /**
   * Delete a variation
   */
  deleteVariation(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/variations/delete.php', { id });
  }

  // Variation Options methods
  /**
   * Get all variation options
   */
  getVariationOptions(): Observable<VariationOption[]> {
    return this.get<VariationOption[]>('/variation-options/list.php');
  }

  /**
   * Get variation options by variation ID
   */
  getVariationOptionsByVariationId(variationId: number): Observable<VariationOption[]> {
    return this.get<VariationOption[]>('/variation-options/list.php', { variation_id: variationId });
  }

  /**
   * Get a specific variation option by ID
   */
  getVariationOptionById(id: number): Observable<VariationOption> {
    return this.get<VariationOption>('/variation-options/get.php', { id });
  }

  /**
   * Create a new variation option
   */
  createVariationOption(variationOption: Partial<VariationOption>): Observable<ApiResponse<VariationOption>> {
    return this.post<ApiResponse<VariationOption>>('/variation-options/add.php', variationOption);
  }

  /**
   * Update an existing variation option
   */
  updateVariationOption(variationOption: VariationOption): Observable<ApiResponse<VariationOption>> {
    return this.put<ApiResponse<VariationOption>>('/variation-options/update.php', variationOption);
  }

  /**
   * Delete a variation option
   */
  deleteVariationOption(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/variation-options/delete.php', { id });
  }

  // Item Variations methods
  /**
   * Get all item variations
   */
  getItemVariations(): Observable<ItemVariation[]> {
    return this.get<ItemVariation[]>('/item-variations/list.php');
  }

  /**
   * Get item variations by product ID
   */
  getItemVariationsByProductId(productId: number): Observable<ItemVariation[]> {
    return this.get<ItemVariation[]>('/item-variations/list.php', { product_id: productId });
  }

  /**
   * Create a new item variation
   */
  createItemVariation(itemVariation: Partial<ItemVariation>): Observable<ApiResponse<ItemVariation>> {
    return this.post<ApiResponse<ItemVariation>>('/item-variations/add.php', itemVariation);
  }

  /**
   * Delete an item variation
   */
  deleteItemVariation(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/item-variations/delete.php', { id });
  }

  /**
   * Get variations with their options for a company
   */
  getVariationsWithOptions(companyId: number): Observable<(Variation & { options: VariationOption[] })[]> {
    // This would require a custom endpoint or multiple API calls
    // For now, returning the basic variations
    return this.getVariations(companyId) as any;
  }
}
