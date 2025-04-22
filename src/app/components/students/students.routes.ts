import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./student-form/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./student-detail/student-detail.component').then(m => m.StudentDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./student-form/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [adminGuard]
  }
];