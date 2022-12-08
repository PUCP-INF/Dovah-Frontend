import HttpClient from "../http-common";

export const listarCursos = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("curso")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const buscarCursoPorId = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };


//se debe pasar un objeto que contenga idEspecialidad, idSemestre y datos del nuevo curso
export const agregarCurso = (curso) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("/curso", curso)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

//datos del curso excepto el id
export const actualizarCurso = (curso) => {
    return new Promise((resolve, reject) => {
      HttpClient.post("curso/actualizar", curso)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };


//pasar un objeto curso incluido el id
export const eliminarCurso = (curso) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("curso/eliminar", curso)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const listarCursosPorIdEspecialidad = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/ListarPorEspecialidad/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  export const listarCursosPorIdSemestre = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/ListarPorSemestre/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };


  //el objeto debe contener el idCurso y elidUsuario
  export const agregarUsuario = (usuario) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/agregarUsuario", usuario)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  export const listarUsuariosPorIdCurso = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/listarUsuarios/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  export const listarAlumnosPorIdCurso = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/listarAlumnosCurso/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };
  export const listarProfesoresPorIdCurso = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/listarProfesoresPorCurso/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  //el objeto debe contener el idCurso y elidUsuario
  export const eliminarUsuario = (usuario) => {
    return new Promise((resolve, reject) => {
      HttpClient.post("curso/eliminarUsuario", usuario)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

//Funciones para el control de pantalla inicial de cursos por usuario
  export const listarCursosPorIdUsuario = (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("/curso/listarCursosPorUsuario/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  export const agregarDocumentoporCurso = (documento) => {
    return new Promise((resolve, reject) => {
      HttpClient.post("curso/agregarDocumentoGeneral", documento)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

  export const listarDocumentosGeneralesPorCurso= (id) => {
    return new Promise((resolve, reject) => {
      HttpClient.get("curso/listarDocumentos/" + id)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };
  
  export const eliminarDocumentoGeneral = (documento) => {
    return new Promise((resolve, reject) => {
      HttpClient.post("curso/eliminarDocumentoGeneral",documento)
        .then((resultado) => {
          resolve(resultado);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };
  