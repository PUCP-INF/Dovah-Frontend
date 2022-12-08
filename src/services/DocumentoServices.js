import HttpClient from "../http-common";

export const listarArchivos = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("documento")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const encontrarArchivo=(id)=>{
  return new Promise((resolve, reject) => {
    HttpClient.get("documento/"+ id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}


export const agregarArchivo = (documento) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("documento",documento) /*Ingresa el nombre y el documento en base 64*/
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarArchivo = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.delete("documento/eliminar/"+ id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};