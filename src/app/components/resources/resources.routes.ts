import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const RESOURCES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./resource-form/resource-form.component').then(m => m.ResourceFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./resource-form/resource-form.component').then(m => m.ResourceFormComponent),
    canActivate: [adminGuard]
  }
];