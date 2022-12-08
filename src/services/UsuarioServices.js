import HttpClient from "../http-common";

export const listarUsuarios = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("usuario")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const insertarUsuario = (usuario) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("usuario", usuario)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const actualizarUsuario = (usuario) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("usuario/modificar", usuario)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarUsuario = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("usuario/eliminar", id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const buscarUsuarioPorId = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/usuario/"+ id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const listarUsuariosPorCurso = (idEspecialidad, idCurso) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/usuario/especialidad/"+idEspecialidad+"/in/curso/"+idCurso)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
