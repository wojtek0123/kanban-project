import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SupabaseService } from '../../../../shared/services/supabase.service';

export const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    providers: [SupabaseService],
  },
];
