import HttpClient from "../http-common";

export const listarSemestres = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("semestre")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarSemestre = (semestre) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("semestre", semestre)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const actualizarSemestre = (semestre) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("semestre/actualizar", semestre)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarSemestre = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("semestre/eliminar", id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarCursoXSemestre = (idCurso, idSemestre) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("semestre/agregarCurso", idCurso, idSemestre)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
