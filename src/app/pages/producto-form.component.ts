import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent {
  form: FormGroup;
  error: string | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const hoy = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      id: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [hoy, Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.form.get('date_release')?.valueChanges.subscribe(release => {
      const revision = this.form.get('date_revision')?.value;
      if (release && revision) {
        this.validarFechas();
      }
    });

    this.form.get('date_revision')?.valueChanges.subscribe(() => this.validarFechas());

    if (id) {
      this.isEdit = true;
      this.form.get('id')?.disable();

      this.productosService.getProductoById(id).subscribe(producto => {
        this.form.patchValue(producto);
      });
    }
  }

  validarFechas(): void {
    const releaseStr = this.form.get('date_release')?.value;
    const revisionStr = this.form.get('date_revision')?.value;

    if (!releaseStr || !revisionStr) return;

    const release = new Date(releaseStr);
    const revision = new Date(revisionStr);

    if (isNaN(release.getTime()) || isNaN(revision.getTime())) return;
    const esperado = new Date(release);
    esperado.setFullYear(esperado.getFullYear() + 1);

    const esValida = revision.toISOString().slice(0, 10) === esperado.toISOString().slice(0, 10);

    if (!esValida) {
      this.form.get('date_revision')?.setErrors({ incorrecto: true });
    } else {
      this.form.get('date_revision')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const id = this.route.snapshot.paramMap.get('id');
    const producto = this.form.getRawValue();

    if (id) {
      this.productosService.actualizarProducto(id, producto).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.error = 'Error al actualizar el producto.'
      });
    } else {
      this.productosService.verificarIdExiste(producto.id).subscribe({
        next: (existe) => {
          if (existe) {
            this.error = 'El ID ya existe.';
            return;
          }

          this.productosService.crearProducto(producto).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.error = 'Error al crear el producto.'
          });
        },
        error: () => this.error = 'Error al verificar ID.'
      });
    }
  }


  resetForm() {
    this.form.reset();
  }
}
