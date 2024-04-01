import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../../../../../shared/services/supabase.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormStatus } from '../../../../../shared/models/form-status.type';
import { InputDirective } from '../../../../../shared/directives/input.directive';

@Component({
  selector: 'app-register-form',
  template: `
    <form class="w-96 flex flex-col gap-2" [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="flex flex-col">
        <label class="" for="email">Email</label>
        <input
          input
          type="email"
          id="email"
          name="email"
          [ngClass]="{
            'border-red-500': form.controls.email.invalid && (form.controls.email.touched || isSubmitted)
          }"
          formControlName="email" />
        @if (form.controls.email.getError('email') && (form.controls.email.touched || isSubmitted)) {
          <span class="text-red-500">Email is invalid</span>
        }
        @if (form.controls.email.getError('required') && (form.controls.email.touched || isSubmitted)) {
          <span class="text-red-500">Email is required</span>
        }
      </div>
      <div class="flex flex-col">
        <label class="" for="nick">Nickname</label>
        <input
          input
          type="text"
          id="nick"
          formControlName="nickname"
          [ngClass]="{
            'border-red-500': form.controls.nickname.invalid && (form.controls.nickname.touched || isSubmitted)
          }"
          required />
        @if (form.controls.nickname.getError('required') && (form.controls.nickname.touched || isSubmitted)) {
          <span class="text-red-500">Nickname is required</span>
        }
        @if (form.controls.nickname.getError('maxLength') && (form.controls.nickname.touched || isSubmitted)) {
          <span class="text-red-500">Nickname has max 25 characters</span>
        }
      </div>
      <div class="flex flex-col">
        <label class="" for="password">Password</label>
        <input
          input
          type="password"
          id="password"
          formControlName="password"
          [ngClass]="{
            'border-red-500': form.controls.password.invalid && (form.controls.password.touched || isSubmitted)
          }" />
        @if (form.controls.password.getError('minlength') && (form.controls.password.touched || isSubmitted)) {
          <span class="text-red-500"> Password should have at least 8 characters </span>
        }
        @if (form.controls.password.getError('required') && (form.controls.password.touched || isSubmitted)) {
          <span class="text-red-500">Password is required</span>
        }
      </div>
      <div class="flex flex-col">
        <label class="" for="confirm-password">Confirm password</label>
        <input
          input
          type="password"
          id="confirm-password"
          formControlName="confirmPassword"
          [ngClass]="{
            'border-red-500':
              form.controls.confirmPassword.invalid && (form.controls.confirmPassword.touched || isSubmitted)
          }" />
        @if (
          form.controls.confirmPassword.getError('required') && (form.controls.confirmPassword.touched || isSubmitted)
        ) {
          <span class="text-red-500">Confirm password is required</span>
        }
        @if (
          form.controls.confirmPassword.getError('passwordMismatch') &&
          (form.controls.confirmPassword.touched || isSubmitted)
        ) {
          <span class="text-red-500">Passwords do not match</span>
        }
      </div>
      <button type="submit" class="bg-dark-gray py-2 rounded-lg mt-4 active:bg-dark-gray/80">
        @if (status === 'loading') {
          <span>Loading...</span>
        } @else {
          <span>Sign up</span>
        }
      </button>
    </form>
  `,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  status: FormStatus = 'idle';
  isSubmitted = false;

  form = this.fb.group(
    {
      email: [null, [Validators.email, Validators.required]],
      nickname: [null, [Validators.maxLength(25), Validators.required]],
      password: [null, [Validators.minLength(8), Validators.required]],
      confirmPassword: [null, [Validators.required]],
    },
    {
      validators: [this.matchPassword('password', 'confirmPassword')],
    }
  );

  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.status = 'loading';

    try {
      const { error, data } = await this.supabase.signUp(
        this.form.controls.email.value ?? '',
        this.form.controls.password.value ?? '',
        this.form.controls.nickname.value ?? ''
      );
      if (error) {
        this.status = 'error';
        // this.errorMessage = error.message;
        return;
      }

      this.supabase.setSession(data.session);

      this.status = 'ok';
      await this.router.navigate(['/projects']);
    } catch (error) {
      if (error instanceof Error) {
        // this.errorMessage = error.message;
      }
      this.status = 'error';
    } finally {
      this.form.reset();
      // this.showToast = true;

      // this.timeoutCleaner = setTimeout(() => {
      //   this.showToast = false;
      // }, 5000);
    }
  }
}
