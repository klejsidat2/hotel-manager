import { Directive, input } from '@angular/core';

@Directive({
  selector: 'button[appConfirm]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class ConfirmDirective {
  appConfirm = input('A je i sigurt?');

  onClick(event: MouseEvent) {
    if (!window.confirm(this.appConfirm())) {
      event.stopImmediatePropagation();
    }
  }
}