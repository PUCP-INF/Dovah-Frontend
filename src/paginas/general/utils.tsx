import type {Documento, Usuario} from "./DovahTypes";
import axios from "axios";

export const userHasRoles = (user: Usuario, roles: Array<string>): boolean => {
    const found = user.listaRoles.find(e => roles.includes(e.nombre));
    return typeof found !== "undefined";
}

export const subirDocumento = async (file: File, nombre?: string): Promise<Documento> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nombre", nombre ?? file.name);
    const response = await axios.post<Documento>("/documento/crear", formData);
    return response.data;
}