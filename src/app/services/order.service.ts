import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Order, OrderCreateRequest, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService {

  /**
   * Get all orders
   */
  getOrders(): Observable<Order[]> {
    return this.get<Order[]>('/orders/list.php');
  }

  /**
   * Get a specific order by ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.get<Order>('/orders/get.php', { id });
  }

  /**
   * Get orders by customer ID
   */
  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.get<Order[]>('/orders/get-by-customer-id.php', { customer_id: customerId });
  }

  /**
   * Create a new order
   */
  createOrder(orderData: OrderCreateRequest): Observable<ApiResponse<Order>> {
    return this.post<ApiResponse<Order>>('/orders/add.php', orderData);
  }

  /**
   * Update an existing order
   */
  updateOrder(order: Order): Observable<ApiResponse<Order>> {
    return this.put<ApiResponse<Order>>('/orders/update.php', order);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: number, status: Order['status']): Observable<ApiResponse> {
    return this.put<ApiResponse>('/orders/update.php', {
      id: orderId,
      status
    });
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(orderId: number, paymentStatus: Order['payment_status']): Observable<ApiResponse> {
    return this.put<ApiResponse>('/orders/update.php', {
      id: orderId,
      payment_status: paymentStatus
    });
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: number): Observable<ApiResponse> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  /**
   * Mark order as shipped
   */
  shipOrder(orderId: number): Observable<ApiResponse> {
    return this.updateOrderStatus(orderId, 'shipped');
  }

  /**
   * Mark order as delivered
   */
  deliverOrder(orderId: number): Observable<ApiResponse> {
    return this.updateOrderStatus(orderId, 'delivered');
  }

  /**
   * Delete an order
   */
  deleteOrder(id: number): Observable<ApiResponse> {
    return this.delete<ApiResponse>('/orders/delete.php', { id });
  }
}
