import HttpClient from "../http-common";

export const listarTareas = () => {
  return new Promise((resolve, reject) => {
    HttpClient.get("tareas")
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarTarea = (tarea) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("tareas",{
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      idCurso: 32,
      fechaLimite: new Date(Date.parse(tarea.fechaLimite, "dd/mm/YYYY"))
    })
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
export const eliminarTarea2 = (id) => {
  return new Promise((resolve, reject) => {
    console.log(parseInt(id.id));
    HttpClient.post("/tareas/eliminar/"+ parseInt(id.id))
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
    console.log(parseInt(id.id));
  });
};

export const eliminarTarea = (id) => {
  return new Promise((resolve, reject) => {
    HttpClient.delete("tareas/eliminar/" + id)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const actualizarTarea = (tarea) => {
    return new Promise((resolve, reject) => {

    });
};

export const cambiarVisibilidad = (idTarea, visibilidad) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("tareas/cambiarVisibilidad", {
      idTarea: idTarea, 
      visible: visibilidad
    })
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarTareaEntrega = (documento) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("/tareas/agregarEntrega",documento) 
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};


export const obtenerDocumentoPorTareaEntrega = (idAlumno,idTarea) => {
  return new Promise((resolve, reject) => {
    HttpClient.get("tareas/obtenerDocumentoTareaEntrega/alumno/"+idAlumno+"/tarea/"+idTarea)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const eliminarDocumentoEntrega = (documento) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("/tareas/eliminarEntregaDocumento",documento) 
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

export const agregarDocumentoEntrega = (documento) => {
  return new Promise((resolve, reject) => {
    HttpClient.post("/tareas/agregarDocumentoTareaEntrega", documento)
      .then((resultado) => {
        resolve(resultado);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};