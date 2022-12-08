export type NuevoDocumento = {
    file: File | null,
    nombre: string
}

export type Criterio = {
    id: number,
    titulo: string,
    descripcion: string,
    notaMaxima: number,
    notaObtenida: number
}

export type Rubrica = {
    id: number,
    notaMaximaTotal: number,
    criterios: Array<Criterio>
}

export type Retroalimentacion = {
    id: number,
    profesor: Profesor,
    fechaCreacion: string,
    notaFinal: number,
    notasObtenidas: {}
}

export type Tarea = {
    id: number,
    nombre: string,
    descripcion: string,
    peso: number,
    rubrica: Rubrica,
    fechaLimite: string,
    rolesEncargados: Array<Rol | string>,
    curso: Curso,
    visible: boolean,
    esExposicion: boolean,
    vistoBueno: boolean,
    necesitaVistoBueno: boolean,
}

export interface Usuario {
    idUsuario: number,
    nombre: string,
    apellido: string,
    picture: string,
    rolActual: string,
    codigoPUCP: string,
    correo: string,
    password: string,
    listaRoles: Array<Rol>,
    especialidad: Especialidad
}

export type Documento = {
    id: number,
    usuario: Usuario,
    nombre: string,
    url: string,
    fechaCreacion: string
}

export type Hilo = {
    uuid: string,
    comentarios: Array<Comentario>
}

export type Comentario = {
    id: number,
    fechaCreacion: string,
    usuario: Usuario,
    mensaje: string,
    documento: Documento
}

export type Alumno = {
    id: number,
    usuario: Usuario
}

export type Rol = {
    idRol: number,
    nombre: string
}

export enum EstadoEntrega {
    pendiente = "PENDIENTE",
    revisada = "REVISADA",
    finalizada = "FINALIZADA"
}

export type TareaEntrega = {
    id: number,
    tarea: Tarea,
    listaDocumentos: Array<Documento>,
    retroalimentaciones: Array<Retroalimentacion>,
    alumno: Alumno,
    hilo: Hilo,
    avances: Hilo,
    notaFinal: number,
    ultimaModificacion: string,
    vistoBueno: boolean,
    estadoEntrega: string,
    planTesis: PlanTesis
}

export type Curso = {
    idCurso: number,
    semestre: Semestre,
    nombre: string,
    clave: string
}

export type Semestre = {
    anhoAcademico: string,
    periodo: string,
    idSemestre: number
}

export type Periodo = {
    fechaInicio: string,
    fechaFin: string
}

export interface Profesor {
    id: number,
    usuario: Usuario,
    roles: Array<Rol>
}

export interface Especialidad {
    idEspecialidad: number
}

export interface AreaEspecialidad {
    id: number,
    nombre: string
}

export interface PlanTesis {
    id: number,
    titulo: string,
    estado: string,
    nombre: string,
    descripcion: string,
    areaEspecialidad: AreaEspecialidad,
    detallesAdicionales: string,
    proponiente: Usuario,
    hilo: Hilo
}

export type ProfesorTesis = {
    activo: boolean,
    id: number,
    planTesis: PlanTesis,
    profesor: Profesor,
    roles: Array<Rol>
}