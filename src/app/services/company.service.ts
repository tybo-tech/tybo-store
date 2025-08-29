import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Company, CollectionData, UploadResponse, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseApiService {

  /**
   * Get all companies
   */
  getCompanies(): Observable<Company[]> {
    return this.get<Company[]>('/companies/list.php');
  }

  /**
   * Get a specific company by ID
   */
  getCompanyById(id: number): Observable<Company> {
    return this.get<Company>('/companies/get.php', { id });
  }
}
