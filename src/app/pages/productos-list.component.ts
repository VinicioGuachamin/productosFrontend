import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../services/productos.service';
import { Product } from '../models/product.model';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {ConfirmModalComponent} from '../shared/confirm-modal.component';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.scss'],
  providers: [ProductosService]
})
export class ProductosListComponent implements OnInit {
  productos: Product[] = [];
  loading = true;
  error: string | null = null;
  busqueda = '';
  cantidad = 5;
  menuAbierto: string | null = null;
  productoAEliminar: Product | null = null;

  constructor(private productosService: ProductosService,
              private router: Router) {}

  ngOnInit(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos.';
        console.error(err);
        this.loading = false;
      }
    });
    document.addEventListener('click', this.cerrarMenuFuera);
  }

  productosFiltrados(): Product[] {
    const texto = this.busqueda.toLowerCase().trim();
    return this.productos
      .filter(p =>
        p.name.toLowerCase().includes(texto) ||
        p.description.toLowerCase().includes(texto)
      )
      .slice(0, this.cantidad);
  }

  irACrear() {
    this.router.navigate(['/crear']);
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) return '';
    const partes = nombre.trim().split(' ');
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  editar(id: string) {
    console.log(id);
    this.router.navigate(['/editar', id]);
  }

  cerrarMenuFuera = (): void => {
    this.menuAbierto = null;
  };

  abrirModal(producto: Product): void {
    this.productoAEliminar = producto;
  }

  cerrarModal(): void {
    this.productoAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.productoAEliminar) return;

    this.productosService.eliminarProducto(this.productoAEliminar.id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== this.productoAEliminar?.id);
        this.productoAEliminar = null;
        this.menuAbierto = null;
      },
      error: () => {
        alert('Error al eliminar el producto.');
      }
    });
  }
}
