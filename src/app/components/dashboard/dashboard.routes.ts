import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user-dashboard'
  },
  {
    path: 'user-dashboard',
    loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  }
];