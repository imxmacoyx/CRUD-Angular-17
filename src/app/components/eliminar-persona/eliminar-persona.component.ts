import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-eliminar-persona',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './eliminar-persona.component.html',
  styleUrl: './eliminar-persona.component.scss'
})
export class EliminarPersonaComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarPersonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}
