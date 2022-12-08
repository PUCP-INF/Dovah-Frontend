import HttpClient from "../http-common";

export const listarUsuarios = () => {
    return new Promise((resolve, reject) => {
      HttpClient.get("admin/listar/coordinador")
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

export const insertarUsuario = (coordinador) => {
    return new Promise((resolve, reject) => {
        HttpClient.post("admin/nuevo/coordinador", coordinador)
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
      HttpClient.delete("admin/eliminar/coordinador/"+ id)
        .then((resultado) => {
          resolve(resultado);
          console.log("Hay resultado en admin eliminarUsuario");
        })
        .catch((error) => {
          console.log("Error en admin eliminarusuario");
          resolve(error);
        });
    });
  };

  export const actualizarUsuario = (usuario) => {
    return new Promise((resolve, reject) => {
      HttpClient.put("admin/modificar/coordinador", usuario)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };