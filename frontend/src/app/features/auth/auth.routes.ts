import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./features/login/login.routes').then((m) => m.loginRoutes),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./features/register/register.routes').then(
            (m) => m.registerRoutes,
          ),
      },
    ],
  },
];
