import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <footer>
      <a href="http://imsoftware.pro/"  target="_blank">Hecho por Marco Valle</a>
    </footer>
  `,
  styles: [
    `
      footer {
        padding: 20px;
        text-align: center;
        color: white;
      }
      a {
        outline: none;
        text-decoration: none;
        color: white;
      }
    `,
  ],
})
export class FooterComponent {}
