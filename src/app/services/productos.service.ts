import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly API_URL = `${environment.apiUrl}/bp/products`;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  getProductoById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  verificarIdExiste(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/verification/${id}`);
  }

  crearProducto(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  actualizarProducto(id: string, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  eliminarProducto(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
