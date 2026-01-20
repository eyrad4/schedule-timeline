import { Component } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  template: `
    <ng-content />
  `,
  styles: [
      `
          :host {
              display: block;
              font-family: var(--font-family-medium);
              color: var(--color-primary);
              font-weight: 500;
              font-size: 24px;
          }
      `
  ]
})
export class Title {

}
