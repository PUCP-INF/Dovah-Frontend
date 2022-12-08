import HttpClient from "../http-common";

export const listarFacultades = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("facultad")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarFacultad = (facultad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("facultad", facultad)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const facultadAgregarEspecialidad = (idFacEspecialidad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("facultad/agregarEspecialidad", idFacEspecialidad) //objeto con el idfacultad y la especialidad
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const actualizarFacultad = (facultad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("facultad/actualizar", facultad)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarFacultad = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("facultad/eliminar", id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
