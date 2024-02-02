import { Component, Inject, OnDestroy, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { IPersonaApi } from '../../core/models/personas-paginadas.api';
import { PersonaService } from '../../core/services/persona.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ver-persona',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, MatCardModule, DatePipe],
  templateUrl: './ver-persona.component.html',
  styleUrl: './ver-persona.component.scss'
})
export class VerPersonaComponent implements OnDestroy {

  subscription!: Subscription; 
  personaSeleccionada!: IPersonaApi;
  loading = true;
  private readonly personaService = inject(PersonaService);
   

  constructor(
    public dialogRef: MatDialogRef<VerPersonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription = this.personaService.getPersonaPorId(data.persona.id).subscribe({
      next: (persona) => {
        this.personaSeleccionada = persona;
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error al obtener la persona', error);
        this.loading = false; 
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


}
