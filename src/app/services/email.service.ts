import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from '../models';

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  from?: string;
  cc?: string;
  bcc?: string;
}

export interface EmailTemplateData {
  template: 'welcome' | 'reset-password' | 'billing';
  to: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService extends BaseApiService {

  /**
   * Send a general email
   */
  sendEmail(emailData: EmailData): Observable<ApiResponse> {
    return this.post<ApiResponse>('/email/email.php', emailData);
  }

  /**
   * Send a general email using the general template
   */
  sendGeneralEmail(emailData: EmailData): Observable<ApiResponse> {
    return this.post<ApiResponse>('/email/general-email.php', emailData);
  }

  /**
   * Send welcome/activation email
   */
  sendWelcomeEmail(emailData: { to: string; username: string; activation_link: string }): Observable<ApiResponse> {
    return this.post<ApiResponse>('/email/email-welcome-activate-account.php', emailData);
  }

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(emailData: { to: string; reset_link: string }): Observable<ApiResponse> {
    return this.post<ApiResponse>('/email/email-reset-password-link.php', emailData);
  }

  /**
   * Send billing email
   */
  sendBillingEmail(emailData: { to: string; invoice_data: any }): Observable<ApiResponse> {
    return this.post<ApiResponse>('/email/email-billing.php', emailData);
  }
}
