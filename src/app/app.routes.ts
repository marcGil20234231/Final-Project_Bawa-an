import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about-topic',
    loadComponent: () => import('./components/about-topic/about-topic.component').then(m => m.AboutTopicComponent)
  },
  {
    path: 'about-authors',
    loadComponent: () => import('./components/about-authors/about-authors.component').then(m => m.AboutAuthorsComponent)
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/courses/courses.routes').then(m => m.COURSES_ROUTES)
  },
  {
    path: 'teachers',
    loadChildren: () => import('./components/teachers/teachers.routes').then(m => m.TEACHERS_ROUTES)
  },
  {
    path: 'students',
    loadChildren: () => import('./components/students/students.routes').then(m => m.STUDENTS_ROUTES)
  },
  {
    path: 'resources',
    loadChildren: () => import('./components/resources/resources.routes').then(m => m.RESOURCES_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];