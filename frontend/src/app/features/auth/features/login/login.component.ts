import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from './components/login-form.component';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex flex-col mb-6">
      <h2 class="!text-4xl !mb-1">Welcome back!</h2>
      <span class="text-base">Sign in to your account</span>
    </div>
    <app-login-form />
    <div class="flex items-center gap-2 mt-4 text-base">
      <span>Don't have account?</span>
      <a class="text-primary" [routerLink]="['../register']">Sing up</a>
    </div>
  `,
  standalone: true,
  imports: [RouterLink, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
