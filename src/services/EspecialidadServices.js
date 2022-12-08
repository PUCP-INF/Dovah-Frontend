import HttpClient from "../http-common";

export const listarEspecialidades = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("especialidad")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const listarEspecialidadesPorIdFacultad = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("especialidadListar/" + id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const agregarEspecialidad = (especialidad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("especialidad", especialidad)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const eliminarEspecialidad = (especialidad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("especialidad/eliminar", especialidad)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const actualizarEspecialidad = (especialidad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("especialidad/actualizar", especialidad)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const obtenerEspecialidadPorId= (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("especialidad/" + id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
