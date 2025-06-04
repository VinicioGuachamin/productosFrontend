import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductosService } from './productos.service';
import { environment } from '../../environments/environment';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiUrl}/bp/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductosService],
    });

    service = TestBed.inject(ProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe obtener productos', () => {
    const dummyData = [{ id: '1', name: 'Producto', description: '', logo: '', date_release: '', date_revision: '' }];
    service.getProductos().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].id).toBe('1');
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyData });
  });

  it('debe verificar si el ID existe', () => {
    service.verificarIdExiste('123').subscribe(existe => {
      expect(existe).toBeTrue();
    });

    const req = httpMock.expectOne(`${API_URL}/verification/123`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('debe eliminar un producto', () => {
    service.eliminarProducto('123').subscribe(res => {
      expect(res.message).toBe('ok');
    });

    const req = httpMock.expectOne(`${API_URL}/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'ok' });
  });
});
