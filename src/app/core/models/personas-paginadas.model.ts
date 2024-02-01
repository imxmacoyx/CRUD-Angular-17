export interface IPersonasPaginada {
    totalRecords: number
    page: number
    pageSize: number
    totalPages: number
    data: IPersona[]
}
  
export interface IPersona{
    id: number
    nombre: string
    edad: number
    email: string
}