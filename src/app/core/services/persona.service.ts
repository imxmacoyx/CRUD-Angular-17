import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, retry, throwError } from 'rxjs';
import { IPersona } from '../models/persona.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPersonasPaginada } from '../models/personas-paginadas.model';
import { IPersonasPaginadaApi } from '../models/personas-paginadas.api';
import { IPersonaApi } from '../models/persona.api';
import { IPersonaUpdateApi } from '../models/persona-update.api';
import { IPersonaCreationApi } from '../models/persona-creation.api';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private readonly http = inject(HttpClient);

  /**
   * Obtiene todas las personas.
   * @returns {Observable<IPersona[]>} Un Observable que contiene un array de personas.
   * @example
   * this.personaService.getPersonas().subscribe({
   *   next: (personas) => console.log(personas),
   *   error: (error) => console.error(error)
   * });
   */
  getPersonas(): Observable<IPersona[]> {
    const apiUrl: string = 'https://localhost:7144/personas';
    return this.http.get<IPersonaApi[]>(apiUrl).pipe(
      retry(3),
      map((personasApi) => this.procesarPersonasApi(personasApi)),
      catchError((error) => {
        console.log('Se produjo un error al obtener las personas:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene las personas de manera paginada.
   * @param {number} page - La página de resultados que se desea obtener.
   * @param {number} pageSize - El número de resultados por página.
   * @returns {Observable<IPersonasPaginada>} Un Observable que contiene los datos paginados de las personas.
   * @example
   * this.personaService.getPersonasPaginadas(1, 10).subscribe({
   *   next: (resultado) => console.log(resultado),
   *   error: (error) => console.error(error)
   * });
   */
  getPersonasPaginadas(
    page: number,
    pageSize: number
  ): Observable<IPersonasPaginada> {
    const apiUrl: string = 'https://localhost:7144/personas';
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<IPersonasPaginadaApi>(`${apiUrl}Paginadas`, { params })
      .pipe(
        map((response) => this.adaptarAPersonaPaginada(response)),
        catchError((error) => {
          console.error('Error al obtener personas paginadas:', error);
          return of({} as IPersonasPaginada);
        })
      );
  }

  /**
   * Actualiza los datos de una persona.
   * @param {number} id - El ID de la persona que se desea actualizar.
   * @param {IPersonaUpdateApi} persona - El objeto que contiene los datos de la persona a actualizar.
   * @returns {Observable<any>} Un Observable que completa si la actualización es exitosa.
   * @example
   * const personaActualizada = { nombre: 'Nuevo Nombre', edad: 30, email: 'email@example.com' };
   * this.personaService.actualizarPersona(1, personaActualizada).subscribe({
   *   next: () => console.log('Actualización exitosa'),
   *   error: (error) => console.error(error)
   * });
   */
  actualizarPersona(id: number, persona: IPersonaUpdateApi): Observable<any> {
    let apiUrl = 'https://localhost:7144/persona';
    return this.http.put(`${apiUrl}/${id}`, persona).pipe(
      catchError((error) => {
        console.error('Error al actualizar la persona:', error);
        return of(null);
      })
    );
  }

  /**
   * Crea una nueva persona.
   * @param {IPersonaCreationApi} persona - El objeto que contiene los datos de la nueva persona.
   * @returns {Observable<IPersona>} Un Observable que contiene la persona recién creada.
   * @example
   * const nuevaPersona = { nombre: 'Nuevo Usuario', edad: 25, email: 'nuevo@example.com' };
   * this.personaService.crearPersona(nuevaPersona).subscribe({
   *   next: (persona) => console.log('Persona creada', persona),
   *   error: (error) => console.error(error)
   * });
   */
  crearPersona(persona: IPersonaCreationApi): Observable<IPersona> {
    let apiUrl = 'https://localhost:7144/persona';
    return this.http.post<IPersonaApi>(apiUrl, persona).pipe(
      map((apiPersona) => this.adaptarAPersona(apiPersona)),
      catchError((error) => {
        console.error('Error al crear la persona:', error);
        return throwError(() => new Error('Error al crear la persona'));
      })
    );
  }


  /**
   * Obtiene una persona por su ID.
   * @param {number} id - El ID de la persona que se desea obtener.
   * @returns {Observable<IPersonaApi>} Un Observable que contiene los datos de la persona.
   * @example
   * this.personaService.getPersonaPorId(1).subscribe({
   *   next: (personaApi) => console.log(personaApi),
   *   error: (error) => console.error(error)
   * });
   */
  getPersonaPorId(id: number): Observable<IPersonaApi> {
    let apiUrl = 'https://localhost:7144/persona';
    return this.http.get<IPersonaApi>(`${apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener la persona:', error);
        return throwError(() => new Error('Error al obtener la persona'));
      })
    );
  }



  private adaptarAPersonaPaginada(
    apiResponse: IPersonasPaginadaApi
  ): IPersonasPaginada {
    return {
      totalRecords: apiResponse.totalRecords,
      page: apiResponse.page,
      pageSize: apiResponse.pageSize,
      totalPages: apiResponse.totalPages,
      data: apiResponse.data
        .filter((persona) => !persona.eliminado)
        .map(this.adaptarAPersona),
    };
  }

  private procesarPersonasApi(personasApi: IPersonaApi[]): IPersona[] {
    if (!personasApi || personasApi.length === 0) {
      console.log('No se encontraron personas o la respuesta está vacía');
      return [];
    }
    return personasApi
      .filter((persona) => !persona.eliminado)
      .map(this.adaptarAPersona);
  }

  private adaptarAPersona(apiPersona: IPersonaApi): IPersona {
    return {
      id: apiPersona.id,
      nombre: apiPersona.nombre,
      edad: apiPersona.edad,
      email: apiPersona.email,
    };
  }
}
