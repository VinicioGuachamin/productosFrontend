import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductoFormComponent } from './producto-form.component';
import { ProductosService } from '../services/productos.service';
import { of } from 'rxjs';

describe('ProductoFormComponent', () => {
  let component: ProductoFormComponent;
  let fixture: ComponentFixture<ProductoFormComponent>;
  let service: ProductosService;

  const productoMock = {
    id: 'nuevo',
    name: 'Producto Test',
    description: 'Descripción de prueba',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ProductoFormComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductosService);
    fixture.detectChanges();
  });

  it('Deberia Crear', () => {
    expect(component).toBeTruthy();
  });

  it('Formulario debe ser inválido si faltan campos', () => {
    component.form.setValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
    expect(component.form.valid).toBeFalse();
  });

  it('Valida fechas inválidas pasado el año', () => {
    component.form.patchValue({
      date_release: '2025-01-01',
      date_revision: '2026-01-02'
    });
    component.validarFechas();
    expect(component.form.get('date_revision')?.errors).toEqual({ incorrecto: true });
  });

  it('Valida fechas válidas un año', () => {
    component.form.patchValue({
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    component.validarFechas();
    expect(component.form.get('date_revision')?.errors).toBeNull();
  });

  it('Debería resetear el formulario ', () => {
    component.form.patchValue({
      id: 'x',
      name: 'test name',
      description: 'desc',
      logo: 'logo',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    component.resetForm();
    expect(component.form.get('name')?.value).toBeNull();
  });

  it('Modo creación navega si el ID no existe', () => {
    spyOn(service, 'verificarIdExiste').and.returnValue(of(false));
    spyOn(service, 'crearProducto').and.returnValue(of(productoMock));
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.form.patchValue(productoMock);
    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('Modo creación muestra error si ID ya existe', () => {
    spyOn(service, 'verificarIdExiste').and.returnValue(of(true));
    component.form.patchValue(productoMock);
    component.onSubmit();
    expect(component.error).toBe('El ID ya existe.');
  });

  it('No lanza error si fechas están vacías', () => {
    component.form.patchValue({ date_release: '', date_revision: '' });
    expect(() => component.validarFechas()).not.toThrow();
  });

  it('No debería enviar si el formulario es inválido', () => {
    component.form.reset();
    const crearSpy = spyOn(service, 'crearProducto');
    component.onSubmit();
    expect(crearSpy).not.toHaveBeenCalled();
  });


});
