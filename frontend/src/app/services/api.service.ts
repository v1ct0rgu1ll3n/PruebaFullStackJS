import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getCustomers(page = 1, pageSize = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers?page=${page}&pageSize=${pageSize}`, { headers: this.getAuthHeaders() });
  }

  getProducts(page = 1, pageSize = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/products?page=${page}&pageSize=${pageSize}`, { headers: this.getAuthHeaders() });
  }

  getOrders(page = 1, pageSize = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders?page=${page}&pageSize=${pageSize}`, { headers: this.getAuthHeaders() });
  }


  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

}
