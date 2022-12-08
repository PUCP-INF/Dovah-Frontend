import HttpClient from "../http-common";

export const listarPlanTesis = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("planTesis")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const insertarPlanTesis = (planTesis) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("planTesis", planTesis)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const actualizarPlanTesis = (planTesis) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("planTesis/modificar", planTesis)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarPlanTesis = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("planTesis/eliminar", id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const listarPlanTesisporUsuario = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/listarPlanTesisPorUsuario/" + id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const ObtenerPeriodoActivo = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("planTesis/getPeriodoActivo")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const listarTodosPorPeriodo = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/porPeriodo/" + id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const obtenerListarInscritosPorPlanTesis = (idPlanTesis) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/listarInscritosPorPlanTesis/" + idPlanTesis)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const obtenerInscritoPlanTesis = (idUsuario) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/obtenerInscritoPlanTesis/" + idUsuario)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const obtenerTesisConUsuarioInscrito = (idUsuario) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/obtenerTesisPorInscrito/" + idUsuario)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const obtenerProfesoresAsociadosAlumnoPlanTesis = (idPlanTesis) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("/planTesis/obtenerProfesoresAsociadosAlumnoPlanTesis/" + idPlanTesis)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
