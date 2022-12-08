import HttpClient from "../http-common";

export const listarRoles = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("rol")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
