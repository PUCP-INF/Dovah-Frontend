import HttpClient from "../http-common";

export const listarProfesores = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("profesor")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const insertarProfesor = (profesor) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("profesor", profesor)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

//el objeto debe contener el idEspecialidad
export const listarProfesoresPorIdEspecialidad = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/profesor/especialidad/"+ id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

