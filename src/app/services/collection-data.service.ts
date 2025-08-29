import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { CollectionData, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CollectionDataService extends BaseApiService {

  /**
   * Get all collection data by collection name
   */
  getCollectionData(collection: string): Observable<CollectionData[]> {
    return this.get<CollectionData[]>('/collection-data/list.php', { collection });
  }

  /**
   * Get collection data by ID
   */
  getCollectionDataById(id: number): Observable<CollectionData> {
    return this.get<CollectionData>('/collection-data/get.php', { id });
  }

  /**
   * Get collection data by parent ID
   */
  getCollectionDataByParent(parentId: number): Observable<CollectionData[]> {
    return this.get<CollectionData[]>('/collection-data/get-by-parent.php', { parent_id: parentId });
  }

  /**
   * Save collection data
   */
  saveCollectionData(data: Partial<CollectionData>): Observable<ApiResponse<CollectionData>> {
    return this.post<ApiResponse<CollectionData>>('/collection-data/save.php', data);
  }

  /**
   * Save multiple collection data entries
   */
  saveMultipleCollectionData(dataArray: Partial<CollectionData>[]): Observable<ApiResponse<CollectionData[]>> {
    return this.post<ApiResponse<CollectionData[]>>('/collection-data/save-many.php', { data: dataArray });
  }

  /**
   * Delete collection data
   */
  deleteCollectionData(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/collection-data/delete.php', { id });
  }
}
