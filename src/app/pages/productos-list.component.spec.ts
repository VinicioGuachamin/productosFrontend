import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductosListComponent } from './productos-list.component';
import { ProductosService } from '../services/productos.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('ProductosListComponent', () => {
  let component: ProductosListComponent;
  let fixture: ComponentFixture<ProductosListComponent>;
  let router: Router;
  let service: ProductosService;

  const mockProductos = [
    { id: '1', name: 'Producto Uno', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '2', name: 'Producto Dos', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideHttpClient()],
    }).overrideComponent(ProductosListComponent, {
      set: {
        providers: [],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductosService);
    router = TestBed.inject(Router);

    spyOn(service, 'getProductos').and.returnValue(of(mockProductos));
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Filtrar productos por nombre', () => {
    component.busqueda = 'uno';
    const resultados = component.productosFiltrados();
    expect(resultados.length).toBe(1);
    expect(resultados[0].name.toLowerCase()).toContain('uno');
  });

  it('Navega a editar', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.editar('123');
    expect(navigateSpy).toHaveBeenCalledWith(['/editar', '123']);
  });

  it('Abrir modal con el producto correcto', () => {
    component.abrirModal(mockProductos[0]);
    expect(component.productoAEliminar?.id).toBe('1');
  });

  it('Toggle menu visibilidad', () => {
    component.toggleMenu('1', new MouseEvent('click'));
    expect(component.menuAbierto).toBe('1');

    component.toggleMenu('1', new MouseEvent('click'));
    expect(component.menuAbierto).toBeNull();
  });

  it('CerrarModal debería poner la variable productoAEliminar en null', () => {
    component.productoAEliminar = mockProductos[0];
    component.cerrarModal();
    expect(component.productoAEliminar).toBeNull();
  });

  it('Debería eliminar el producto y limpiar estado al llamar la función confirmarEliminar', () => {
    spyOn(service, 'eliminarProducto').and.returnValue(of({ message: 'ok' }));
    component.productos = [...mockProductos];
    component.productoAEliminar = mockProductos[0];

    component.confirmarEliminar();

    expect(service.eliminarProducto).toHaveBeenCalledWith('1');
    expect(component.productos.length).toBe(1);
    expect(component.productoAEliminar).toBeNull();
  });

  it('Debería retornar productos limitados por cantidad', () => {
    component.cantidad = 1;
    const resultado = component.productosFiltrados();
    expect(resultado.length).toBe(1);
  });

  it('Debería generar iniciales de un nombre compuesto', () => {
    const iniciales = component.obtenerIniciales('Juan Perez');
    expect(iniciales).toBe('JP');
  });

  it('Debería generar inicial si solo hay un nombre', () => {
    const iniciales = component.obtenerIniciales('Vinicio');
    expect(iniciales).toBe('V');
  });

  it('debería generar vacío si el nombre está vacío', () => {
    const iniciales = component.obtenerIniciales('');
    expect(iniciales).toBe('');
  });

  it('Debería cerrar el menú contextual', () => {
    component.menuAbierto = '2';
    component.cerrarMenuFuera();
    expect(component.menuAbierto).toBeNull();
  });

  it('ToggleMenu debería alternar el estado del menú', () => {
    const event = new MouseEvent('click');
    component.toggleMenu('1', event);
    expect(component.menuAbierto).toBe('1');

    component.toggleMenu('1', event);
    expect(component.menuAbierto).toBeNull();
  });

  it('Debería navegar al crear al llamar irACrear()', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.irACrear();
    expect(navigateSpy).toHaveBeenCalledWith(['/crear']);
  });

  it('Debería cerrar el modal al llamar cerrarModal()', () => {
    component.productoAEliminar = mockProductos[0];
    component.cerrarModal();
    expect(component.productoAEliminar).toBeNull();
  });



});
