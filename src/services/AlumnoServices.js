import HttpClient from "../http-common";

export const listarAlumnos = () => {
    return new Promise((resolve, reject) => {
      HttpClient.get("alumno")
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };
  
  export const insertarAlumno = (alumno) => {
    return new Promise((resolve, reject) => {
      HttpClient.post("alumno", alumno)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };
  

  export const listarAlumnosPorEspecialidad = (objeto) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/listarAlumnosPorEspecialidad",objeto)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

