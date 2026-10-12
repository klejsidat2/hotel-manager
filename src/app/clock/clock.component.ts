import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [DatePipe],
  template: `<span>{{ now() | date: 'EEEE, d MMMM y, HH:mm:ss' }}</span>`,
  styles: `
    span {
      font-size: 0.85rem;
      opacity: 0.85;
    }
  `,
})
export class ClockComponent implements OnInit, OnDestroy {
  now = signal(new Date());
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.timer = setInterval(() => this.now.set(new Date()), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}