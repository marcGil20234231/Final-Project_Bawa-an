import { Routes } from '@angular/router';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./teacher-list/teacher-list.component').then(m => m.TeacherListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./teacher-detail/teacher-detail.component').then(m => m.TeacherDetailComponent)
  }
];