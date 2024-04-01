import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormComponent } from './components/register-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="flex flex-col mb-6">
      <h2 class="!text-4xl !mb-1">Get started!</h2>
      <span class="text-base">Create a new account</span>
    </div>
    <app-register-form></app-register-form>
    <div class="text-base flex items-center gap-2 mt-4">
      <span>Have an account?</span>
      <a class="text-primary" [routerLink]="['../login']">Sign in</a>
    </div>
  `,
  standalone: true,
  imports: [RegisterFormComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {}
