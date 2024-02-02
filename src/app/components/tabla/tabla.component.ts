import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TablaDataSource } from './tabla-datasource';
import { IPersona } from '../../core/models/persona.model';
import {
  startWith,
  switchMap,
  map,
  catchError,
  of,
  merge,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { PersonaService } from '../../core/services/persona.service';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PersonaFormComponent } from '../persona-form/persona-form.component';
import { EliminarPersonaComponent } from '../eliminar-persona/eliminar-persona.component';
import { VerPersonaComponent } from '../ver-persona/ver-persona.component';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconButton,
    MatIconAnchor,
    MatIconModule,
    PersonaFormComponent,
    EliminarPersonaComponent,
  ],
})
export class TablaComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<IPersona>;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy = new Subject<void>();
  dataSource: TablaDataSource;
  displayedColumns = ['id', 'nombre', 'edad', 'email', 'acciones'];

  private readonly personaService = inject(PersonaService);
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.dataSource = new TablaDataSource(this.personaService);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(takeUntil(this.destroy)).subscribe(() => (this.paginator.pageIndex = 0));
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
        catchError(() => of([])),
        takeUntil(this.destroy)
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
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '50%',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result) {
          console.log('Persona agregada', result);
          this.cargarPersonas();
        }
      });
  }

  verPersona(persona: IPersona) {
    const dialogRef = this.dialog.open(VerPersonaComponent, {
      data: { persona: persona },
    });
    
  }

  editarPersona(persona: IPersona) {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '50%',
      data: { persona },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result) {
          console.log('Persona actualizada', result);
          this.cargarPersonas();
        }
      });
  }

  eliminarPersona(persona: IPersona) {
    const dialogRef = this.dialog.open(EliminarPersonaComponent, {
      width: '50%',
      data: { persona: persona },
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((result) => {
      if (result) {
        this.personaService
          .eliminarPersona(persona.id)
          .pipe(takeUntil(this.destroy))
          .subscribe({
            next: () => {
              console.log('Persona eliminada');
              this.cargarPersonas();
            },
            error: (error) => {
              console.error('Error al eliminar la persona', error);
            },
          });
      }
    });
  }
  cargarPersonas(): void {
    this.dataSource.loadPersonas(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
