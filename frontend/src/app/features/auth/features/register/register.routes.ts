import { Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SupabaseService } from '../../../../shared/services/supabase.service';

export const registerRoutes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    providers: [SupabaseService],
  },
];
