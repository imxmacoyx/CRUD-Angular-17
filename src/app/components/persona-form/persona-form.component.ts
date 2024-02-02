import { Component, Inject, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersonaService } from '../../core/services/persona.service';


@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrl: './persona-form.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class PersonaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly personaService = inject(PersonaService);
  title = 'Agregar persona';
  actionButton = 'Crear';

  constructor(
    private dialogRef: MatDialogRef<PersonaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.persona) {
      this.personaForm.patchValue(data.persona);
      this.title = 'Editar persona';
      this.actionButton = 'Actualizar';
    }
  }

  personaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    edad: [null, [Validators.required, Validators.maxLength(3), this.validarEdad]],
    email: ['',[ Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.personaForm.valid) {

      const { nombre, edad, email } = this.personaForm.value;
  
      const personaApi = {
        nombre: nombre ?? '', 
        edad: edad ?? 0,    
        email: email ?? '',
      };
  
      console.log(`personaApi ${nombre} ${edad} ${email}`);
      if (this.data && this.data.persona && this.data.persona.id) {
        this.personaService.actualizarPersona(this.data.persona.id, personaApi).subscribe({
          next: (result) => {
            console.log('Persona actualizada', result);
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error al actualizar la persona', error);
          }
        });
      } else {
        this.personaService.crearPersona(personaApi).subscribe({
          next: (result) => {
            console.log('Persona creada', result);
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error al crear la persona', error);
          }
        });
      }
    }
  }
  

  validarEdad(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (valor === null || valor === '') return null;

    if (!/^\d+$/.test(valor)) {
      return { edadInvalida: true };
    }

    const edad = Number(valor);
    if (edad < 0 || edad > 150) {
      return { edadFueraDeRango: true };
    }
    return null;
  }
}
