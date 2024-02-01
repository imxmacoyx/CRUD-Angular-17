import { Component } from '@angular/core';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-tabla-layout',
  standalone: true,
  imports: [TablaComponent],
  template: `
  <div class="row pt-4">
    <div class="col-2"></div>
    <div class="col-8">
      <app-tabla/>
    </div>
    <div class="col-2"></div>
  </div>
  `,
})
export class TablaLayoutComponent {

}
