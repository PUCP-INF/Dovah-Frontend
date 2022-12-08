import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { useAuth } from "../../../componentes/Context";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useSnackbar } from 'notistack';
import {buscarCursoPorId} from "../../../services/CursoServices";
import {listarUsuariosPorCurso} from "../../../services/UsuarioServices";
import {Curso, Semestre} from "../../general/DovahTypes";

interface CursoRequisitoState {
  id: number | string,
  cursos: Array<Curso>
}

interface SemestreState {
  id: number | string,
  semestres: Array<Semestre>
}

interface CursosPasadosState {
  nombre: string,
  cursos: Array<string>
}

interface CursoForm {
  clave: string,
  nombre: string,
  idEspecialidad: number,
  idSemestre: number,
  idCurso: number
}

const GestiondeCurso = (): JSX.Element => {
  //hook para navegabilidad
  const { user } = useAuth();
  const [semestreState, setSemestreState] = useState<SemestreState>({
    id: "",
    semestres: [],
  });
  const [cursoRequisitoState, setCursoRequisitoState] = useState<CursoRequisitoState>({
    id: "",
    cursos: []
  });
  const [semestrePasado, setSemestrePasado] = React.useState<Semestre | string>("");
  const [cursosPasadoState, setCursoPasadoState] = React.useState<CursosPasadosState>({
    nombre: "",
    cursos: []
  });
  const [cursoForm, setCursoForm] = React.useState<CursoForm>({
    clave: "",
    nombre: "",
    idEspecialidad: user.especialidad.idEspecialidad,
    idSemestre: 0,
    idCurso: 0
  });

  //DATOS PARA INSERTAR UN CURSO:
  const idEspecialidad = user["especialidad"]["idEspecialidad"];

  //contenedeor de la data
  const [cursos, setCursos] = useState<Array<Curso>>([]);

  const [open, setOpen] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);

  const [errorClaveCursoValue, setErrorClaveCursoValue] = useState(false);
  const [errorClaveCursoText, setErrorClaveCursoText] = useState("");
  const [errorNombreCursoValue, setErrorNombreCursoValue] = useState(false);
  const [errorNombreCursoText, setErrorNombreCursoText] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  function validarFormAdd(){
    let cad1= cursoForm.nombre.trim();
    let cad2= cursoForm.clave.trim();
    let flag1;
    let flag2;

    if (cad1 ===""){
      console.log("cadena  nombre vacia");
      setErrorNombreCursoValue(true);
      setErrorNombreCursoText("Debe ingresar un nombre válido") 
      flag1= false;
    }
    else{
      
      setErrorNombreCursoValue(false);
      setErrorNombreCursoText("");
      console.log("Validacion nombre ok")
      flag1= true;
    }

    if (cad2 ===""){
      console.log("cadena clave curso vacia");
      setErrorClaveCursoValue(true);
      setErrorClaveCursoText("Debe ingresar una clave, ej: INF200");
      flag2 = false;
    }
    else{
      setErrorClaveCursoValue(false);
      setErrorClaveCursoText("");
      console.log("Validacion clave ok")
      flag2= true;
    }
    return flag1 && flag2;
  }

  const showData = async () => {
    if (semestreState.id == "") return;
    const res1 = await axios.get(`/curso/especialidad/${idEspecialidad}/semestre/${semestreState.id}`);
    setCursos(res1.data);
    await getCursosPasados();
  };

  const getCursosPasados = async () => {
    const sem = (await axios.get<Semestre | string>(`/semestre/getAnterior/${semestreState.id}`)).data;
    if (typeof sem != "string") {
      const res = await axios.get<Array<Curso>>(`/curso/especialidad/${idEspecialidad}/semestre/${sem.idSemestre}`);
      const newState: CursoRequisitoState = {
        cursos: res.data,
        id: ""
      }
      setCursoRequisitoState(newState);
    }
    const cursos = await axios.get<Array<string>>(`/curso/getPasados/${idEspecialidad}`)
    const otherState: CursosPasadosState = {
      nombre: "",
      cursos: cursos.data
    }
    setSemestrePasado(sem);
    setCursoPasadoState(otherState);
  }

  useEffect(() => {
    axios.get("/semestre").then((response) => {
      setSemestreState({
        id: response.data[0]["idSemestre"],
        semestres: response.data,
      });
    });
  }, []);

  useEffect(() => {
    showData().catch();
    setCursoForm({ ...cursoForm, idSemestre: Number(semestreState.id)});
  }, [semestreState.id]);

  //AGREGAR FACULTAD
  
  function limpiarData(){
    setCursoForm({
      clave: "",
      nombre: "",
      idEspecialidad: user["especialidad"]["idEspecialidad"],
      idSemestre: Number(semestreState.id),
      idCurso: 0
    })
  }

  const modalInsertar = () => {
    setOpen(!open);

    setErrorClaveCursoValue(false);
    setErrorClaveCursoText("");

    setErrorNombreCursoValue(false);
    setErrorNombreCursoText("");

    limpiarData();
  };

  const modalActualizar = (registro?: Curso) => {
    setOpenActualizar(!openActualizar);
    if (typeof registro !== "undefined") {
      setCursoForm({
        ...cursoForm,
        idCurso: registro["idCurso"],
        clave: registro["clave"],
        nombre: registro["nombre"],
      });
    }
  };

  const handleSemestreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSemestreState({ ...semestreState, id: event.target.value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCursoForm({
      ...cursoForm,
      [event.target.name]: event.target.value,
    });
  };

  const addCurso = async () => {
    const validacion = validarFormAdd();
    if (!validacion) return;
    const json = {
      ...cursoForm,
      idCursoRequisito: 0
    }
    if (typeof cursoRequisitoState.id !== "string") json.idCursoRequisito = cursoRequisitoState.id;
    await axios.post("/curso", json);
    await showData();
    modalInsertar();
    enqueueSnackbar("Se ha agregado un nuevo curso", {variant: "success"});  
  };

  const updateCurso = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await axios.post("/curso/actualizar", cursoForm);
    await showData();
    setOpenActualizar(false);
    enqueueSnackbar("Se ha actualizado la información del curso "+ cursoForm.nombre, {variant: "info"});
  };

  const deleteCurso = async (idCurso: number) => {
    const probando = await buscarCursoPorId(idCurso);
    const dataCurso = probando.data;
    const usuariosporCurso = await listarUsuariosPorCurso(idEspecialidad,idCurso);
    const dataAux = usuariosporCurso.data;
    if(dataAux.length === 0){
      await axios.post("/curso/eliminar", {idCurso: idCurso})
      enqueueSnackbar("Se ha eliminado el curso "+dataCurso.nombre+" correctamente", {variant: "success"});  
    }else{
      enqueueSnackbar("El curso "+dataCurso.nombre+" tiene usuarios inscritos", {variant: "error"}); 
    }
    await showData();
  };

  //CARD PARA MOSTRAR CADA CURSO:
  //si se recibe info, se retorna una card por cada elemento del array
  const CursoCard = ({cursos}: {cursos: Array<Curso>}): JSX.Element => {
    let display = null;
    const info = cursos;
    const idSemestre = semestreState.id;
    const semArr = semestreState.semestres;
    let anho = "";
    let periodo = "";
    for( let i = 0 ; i<semArr.length; i++){
      if( idSemestre === semArr[i]["idSemestre"]){
        anho = semArr[i]["anhoAcademico"];
        periodo = semArr[i]["periodo"];
      }
    }

    if (info) {
      display = info.map((x) => {
        let { idCurso, clave, nombre } = x;
        return (
          <Card key={idCurso} className="flex flex-col">
            <div className="flex flex-row align-bottom pb-4">
              <h5 className="mt-1 text-2xl font-bold w-4/5">
                {clave} - {nombre}
                </h5>
              <div className="align-bottom text-right w-1/5">
                <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={() => modalActualizar(x)}
                >
                  <EditIcon/>
                </IconButton>
                <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() =>
                    deleteCurso(idCurso)
                    }
                >
                    <DeleteIcon/>
                </IconButton>
              </div>

            </div>

            <div>
              <Button component={Link} state={x} to={"detallecurso/gestionalumnos"} startIcon={<PersonIcon />}>Gestion de Alumnos</Button>
            </div>
            <div>
              <Button component={Link} state={x} to={"detallecurso/gestionprofesores"} startIcon={<PersonIcon />}>Gestion de Docentes</Button>
            </div>

            <div>
              <Link to="detallecurso/tareas" state={idCurso}>
                <Button startIcon={<AssignmentIcon />}>
                  Gestion de Tareas
                </Button>
              </Link>
            </div>

            <div>
              <Link to="detallecurso/documentosgenerales" state={x}>
                <Button startIcon={<FolderIcon />}>Documentos Generales</Button>
              </Link>
            </div>

            <div>
              <Link to="detallecurso/reportes/*" state={{idCurso: x.idCurso, nombreCurso: x.nombre,clave:x.clave, idSemestre: semestreState.id, anho: anho, periodo: periodo}}>
                <Button startIcon={<BarChartIcon/>}>Reportes</Button>
              </Link>
            </div>
          </Card>
        );
      });
    }

    if (display == null) return <>No hay data</>;

    return (
        <>
          {display}
        </>
    )
  };

  //fin del card para el curso
  return (
    <div className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white">
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">
        <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp">
            Gestión de Cursos
          </p>
        </div>
        <div className="pb-8 flex flex-row">
          <Stack direction="row" spacing={2} className="ml-auto flex mr-4">
            <TextField
              select
              label="Periodo Académico"
              style={{ width: 250 }}
              value={semestreState.id}
              onChange={handleSemestreChange}
            >
              {semestreState.semestres.map((semestre) => {
                return (
                  <MenuItem
                    key={semestre["idSemestre"]}
                    value={semestre["idSemestre"]}
                  >
                    {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
                  </MenuItem>
                );
              })}
            </TextField>
            <Button
              startIcon={<AddSharpIcon fontSize="large" />}
              aria-label="add"
              variant="contained"
              onClick={modalInsertar}
            >
              Nuevo Curso
            </Button>
          </Stack>
        </div>

        <CursoCard cursos={cursos}/>

        {/*aca comienza el form*/}
        <Dialog open={open} maxWidth="sm" fullWidth>
          <DialogTitle>Agregar Curso</DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2}>
              {typeof semestrePasado !== "string" && (
                  <TextField
                      select
                      label={`Curso Requisito (${semestrePasado.anhoAcademico}-${semestrePasado.periodo})`}
                      fullWidth
                      value={cursoRequisitoState.id}
                      onChange={event => {setCursoRequisitoState({...cursoRequisitoState, id: event.target.value})}}
                      size="small"
                  >
                    {cursoRequisitoState.cursos.map((curso) => {
                      return (
                          <MenuItem
                              key={curso.idCurso}
                              value={curso.idCurso}
                          >
                            {`${curso.nombre}`}
                          </MenuItem>
                      );
                    })}
                  </TextField>
              )}
              <TextField
                  select
                  label="Plantillas de curso"
                  fullWidth
                  size="small"
                  value={cursosPasadoState.nombre}
                  onChange={event => {
                    setCursoPasadoState({...cursosPasadoState, nombre: event.target.value})
                    const arr = event.target.value.split("-");
                    setCursoForm({...cursoForm, clave: arr[0], nombre: arr[1]});
                  }}
              >
                {cursosPasadoState.cursos.map(value => {
                  return (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                  )
                })}
              </TextField>
              <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Clave del curso"
                  fullWidth
                  type="text"
                  name="clave"
                  size="small"
                  error= {errorClaveCursoValue}
                  helperText= {errorClaveCursoText}
                  onChange={handleInputChange}
                  value={cursoForm.clave}
              />
              <TextField
                  required
                  margin="normal"
                  label="Nombre del curso"
                  type="text"
                  fullWidth
                  name="nombre"
                  size="small"
                  error= {errorNombreCursoValue}
                  helperText= {errorNombreCursoText}
                  onChange={handleInputChange}
                  value={cursoForm.nombre}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => modalInsertar()}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => addCurso()}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openActualizar} maxWidth="sm" fullWidth>
          <DialogTitle>Modificar Curso</DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
                required
                margin="normal"
                className="form"
                label="Clave del curso"
                fullWidth
                type="text"
                name="clave"
                size="small"
                error= {errorClaveCursoValue}
                helperText= {errorClaveCursoText}
                onChange={handleInputChange}
                value={cursoForm.clave}
            />
            <TextField
                required
                margin="normal"
                label="Nombre del curso"
                type="text"
                fullWidth
                name="nombre"
                size="small"
                error= {errorNombreCursoValue}
                helperText= {errorNombreCursoText}
                onChange={handleInputChange}
                value={cursoForm.nombre}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => modalActualizar()}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={event => updateCurso(event)}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

const Card = styled.div`
  margin: 20px;
  padding: 24px;
  max-width: 100%;
  border-radius: 10px;
  border: 2px solid rgba(249, 249, 249, 0.9);
  box-shadow: rgb(0 0 0 / 7%) 0 26px 30px -10px,
    rgb(0 0 0 / 7%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  display: flex;

  &:hover {
    box-shadow: rgb(0 0 0 / 7%) 0 26px 30px -10px;
    border-color: rgba(4, 35, 84, 0.8);
  }
`;

export default GestiondeCurso;
