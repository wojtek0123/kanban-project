import { Directive } from '@angular/core';

@Directive({
  selector: 'input',
  standalone: true,
  host: {
    class: 'w-full max-w-[24rem] border-2 px-2 py-1 text-black rounded-lg',
  },
})
export class InputDirective {}
