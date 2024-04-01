import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormStatus } from '../../../../../shared/models/form-status.type';
import { SupabaseService } from '../../../../../shared/services/supabase.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputDirective } from '../../../../../shared/directives/input.directive';

@Component({
  selector: 'app-login-form',
  template: `
    <form
      class="w-[24rem] flex flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <div class="flex flex-col">
        <label for="email">Email</label>
        <input
          input
          [ngClass]="{
            'border-red-500':
              form.controls.email.invalid &&
              (form.controls.email.touched || isSubmitted)
          }"
          class="text-black px-2 py-1 rounded-lg"
          type="email"
          formControlName="email"
          id="email"
        />
        @if (
          form.controls.email.getError('required') &&
          (form.controls.email.touched || isSubmitted)
        ) {
          <span class="text-red-500">Email is required</span>
        } @else if (
          form.controls.email.getError('email') &&
          (form.controls.email.touched || isSubmitted)
        ) {
          <span class="text-red-500">Email is invalid</span>
        }
      </div>
      <div class="flex flex-col">
        <label class="form-label" for="password">Password</label>
        <input
          input
          type="password"
          id="password"
          formControlName="password"
          [ngClass]="{
            'border-red-500':
              form.controls.password.invalid &&
              (form.controls.password.touched || isSubmitted)
          }"
        />
        @if (
          form.controls.password.getError('required') &&
          (form.controls.password.touched || isSubmitted)
        ) {
          <span class="text-red-500">Password is required</span>
        } @else if (
          form.controls.password.getError('minlength') &&
          (form.controls.password.touched || isSubmitted)
        ) {
          <span class="text-red-500">
            Password should have at least 8 characters</span
          >
        }
      </div>
      @if (status() === 'error') {
        <span class="form-invalid-message">{{ error }}</span>
      }

      <button
        type="submit"
        class="bg-dark-gray py-2 rounded-lg mt-4 active:bg-dark-gray/80"
      >
        @if (status() !== 'loading') {
          <span>Sign in</span>
        } @else {
          <span>Loading...</span>
        }
      </button>
    </form>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatInputModule,
    MatFormField,
    MatLabel,
    NgClass,
    InputDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  form = this.fb.group({
    email: [null, [Validators.email, Validators.required]],
    password: [null, [Validators.minLength(8), Validators.required]],
  });
  status = signal<FormStatus>('idle');
  isSubmitted = false;
  error: string | null = null;

  async onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.status.set('loading');

    try {
      const { data, error } = await this.supabase.signIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      if (error) {
        this.status.set('error');
        this.error = error.message;
        return;
      }

      this.status.set('ok');
      this.supabase.setSession(data.session);
      return await this.router.navigate(['/projects']);
    } catch (error) {
      this.status.set('error');

      if (error instanceof Error) throw new Error(error.message);

      return error;
    }
  }
}
