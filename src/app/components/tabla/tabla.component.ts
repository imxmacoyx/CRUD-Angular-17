import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TablaDataSource } from './tabla-datasource';
import { IPersona } from '../../core/models/persona.model';
import { startWith, switchMap, map, catchError, of, merge, Observable } from 'rxjs';
import { PersonaService } from '../../core/services/persona.service';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconButton, MatIconAnchor, MatIconModule]
})
export class TablaComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<IPersona>;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: TablaDataSource;
  displayedColumns = ['id', 'nombre', 'edad', 'email', 'acciones'];

  private readonly personaService = inject(PersonaService)

  constructor() {
    this.dataSource = new TablaDataSource(this.personaService);
  }


  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.dataSource.loadPersonas(
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
          return this.dataSource.connect();
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  loadPersonasPage() {
    this.dataSource.loadPersonas(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  

  agregarPersona() {
    // Método para manejar la acción de agregar una nueva persona.
    // Aquí abrirías un diálogo (MatDialog) para crear una nueva persona.
  }

  verPersona(persona: IPersona) {
    // Método para manejar la acción de visualizar detalles de una persona.
    // Podrías abrir un diálogo con la información de la persona.
  }

  editarPersona(persona: IPersona) {
    // Método para manejar la acción de editar una persona.
    // Abrirías un diálogo (MatDialog) con un formulario para editar la persona.
  }

  eliminarPersona(persona: IPersona) {
    // Método para manejar la acción de eliminar una persona.
    // Podrías mostrar un diálogo de confirmación antes de eliminar.
  }

}
