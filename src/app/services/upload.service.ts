import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { UploadResponse, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends BaseApiService {

  /**
   * Upload a file
   */
  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Note: For file uploads, we need to override the base method
    // as we don't want to set Content-Type header (let browser set it)
    return this.post<UploadResponse>('/upload/upload.php', formData);
  }

  /**
   * Upload base64 encoded file
   */
  uploadBase64File(data: { filename: string; data: string; type?: string }): Observable<UploadResponse> {
    return this.post<UploadResponse>('/upload/upload-base-64.php', data);
  }

  /**
   * Upload multiple files
   */
  uploadMultipleFiles(files: File[]): Observable<UploadResponse[]> {
    const uploads = files.map(file => this.uploadFile(file));
    return new Observable(observer => {
      Promise.all(uploads.map(upload => upload.toPromise()))
        .then(results => {
          observer.next(results as UploadResponse[]);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }
}
