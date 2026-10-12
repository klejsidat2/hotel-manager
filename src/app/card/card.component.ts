import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      @if (title()) {
        <h2>{{ title() }}</h2>
      }
      <ng-content />
    </section>
  `,
  styles: `
    section {
      background: white;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
      margin-bottom: 1rem;
    }
    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.1rem;
    }
  `,
})
export class CardComponent {
  title = input('');
}