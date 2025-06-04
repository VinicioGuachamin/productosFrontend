import { Routes } from '@angular/router';
import {ProductosListComponent} from './pages/productos-list.component';
import {ProductoFormComponent} from './pages/producto-form.component';

export const routes: Routes = [
  { path: '', component: ProductosListComponent },
  { path: 'crear', component: ProductoFormComponent },
  { path: 'editar/:id', component: ProductoFormComponent }
];
