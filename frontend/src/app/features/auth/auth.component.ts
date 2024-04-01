import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  template: `
    <header class="flex items-center content-center w-full min-h-svh">
      <div class="w-full xl:max-w-[50rem] flex flex-col items-center justify-center p-8">
        <router-outlet></router-outlet>
      </div>

      <div class="hidden w-full h-svh xl:flex items-center justify-center bg-dark-gray">
        <h1 class="!text-3xl 2xl:!text-5xl w-[30rem] 2xl:w-[48rem]">
          Manage the tasks the simple and easy way with kanban app
        </h1>
      </div>
    </header>
  `,
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    if (this.router.url.split('/').at(-1) === 'auth') {
      this.router.navigate(['/auth/login']);
    }
  }
}
