import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPersona } from '../../core/models/persona.model';
import { IPersonasPaginada } from '../../core/models/personas-paginadas.model';
import { PersonaService } from '../../core/services/persona.service';

/**
 * Data source for the Tabla view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TablaDataSource extends DataSource<IPersona> {
  private dataSubject = new BehaviorSubject<IPersona[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public totalRecords = 0;
  public pageSize = 10;

  constructor(private personaService: PersonaService) {
    super();
  }

  connect(): Observable<IPersona[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadPersonas(page: number, pageSize: number): void {
    this.loadingSubject.next(true);
    this.personaService.getPersonasPaginadas(page + 1, pageSize)
      .subscribe(
        (personasPaginadas: IPersonasPaginada) => {
          this.totalRecords = personasPaginadas.totalRecords;
          this.pageSize = personasPaginadas.pageSize;
          this.dataSubject.next(personasPaginadas.data);
          this.loadingSubject.next(false);
        },
        error => {
          console.error('No puede ser cargadas las personas', error);
          this.dataSubject.next([]);
          this.loadingSubject.next(false);
        }
      );
  }
}
