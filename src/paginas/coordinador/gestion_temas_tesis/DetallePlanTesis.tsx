import React from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import CommentBox from "../../general/CommentBox";
import { useAuth } from "../../../componentes/Context";
import { userHasRoles } from "../../general/utils";
import {Link} from "react-router-dom";
import { useSnackbar } from 'notistack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {AreaEspecialidad, PlanTesis} from "../../general/DovahTypes";

interface AreaState {
  id: string | number,
  areas: Array<AreaEspecialidad>
}

const DetallePlanTesis = (): JSX.Element => {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [correoAsesor, setCorreoAsesor] = React.useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const [tesis, setTesis] = React.useState<PlanTesis | null>(null);
  const [areaState, setAreaState] = React.useState<AreaState>({
    id: "",
    areas: []
  })

  const [esAlumno, setEsAlumno] =React.useState (false);

  const handleClickOpen = () => {
    if (tesis == null) return;
    setOpen(true);
    const vinculoCorreo ="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=" + tesis.proponiente.correo;
    setCorreoAsesor(vinculoCorreo);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getPlanTesis = async () => {
    const response = await axios.get(`/planTesis/${location.state["id"]}`);
    setTesis(response.data);
  };

  const handleGuardarTesis = async () => {
    if (tesis == null) return;
    const rol = user.rolActual;
    const json = {
      ...tesis,
      idAreaEsp: areaState.id
    }
    let response = null;
    
    if (rol === "coordinador" || (rol === "asesor" && user["idUsuario"] === tesis.proponiente.idUsuario)){
      response = await axios.post("/planTesis/modificar", json);
      console.log("1. response", response);
    }

    if(rol === "coordinador" && user["idUsuario"] !== tesis.proponiente.idUsuario){
      response = await axios.post("/planTesis/modificarEstado", json);
      console.log("2. response", response);
    }

    if (response != null) {
      enqueueSnackbar("Se han guardado los cambios de la propuesta", {variant: "success"});
      setTesis(response.data);
    }
  };

  const handleTesisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (tesis == null) return;
    const rol = user.rolActual;
    if (rol === "coordinador" || (rol === "asesor" && user["idUsuario"] === tesis.proponiente.idUsuario)) {
      setTesis({...tesis, [event.target.name]: event.target.value})
    }
  }

  const getData = async () => {
    const idEspecialidad = user["especialidad"]["idEspecialidad"];
    const res1 = await axios.get(`/planTesis/areas/${idEspecialidad}`);
    setAreaState({...areaState, areas: res1.data})
    await getPlanTesis();
  }

  React.useEffect(() => {
    getData().catch();
  }, []);

  React.useEffect(() => {
    if (tesis == null) return;
    setAreaState({...areaState, id: tesis.areaEspecialidad.id});
    if(user["idUsuario"] === tesis.proponiente.idUsuario){
      setEsAlumno(true);
    }
  }, [tesis?.areaEspecialidad]);

  if (tesis == null) return <></>;

  return (
    <Box
      sx={{
        display: "grid",
        gridAutoColumns: "1fr",
        gap: 1,
        gridAutoRows: "20px",
        marginTop: 5,
      }}
    >
      <Box sx={{gridColumn: "span 2", gridRow: 1, display: "grid", gridAutoColumns: "1fr", gap: 1}}>
        <Typography variant="h5">
          Comentarios
        </Typography>
        <CommentBox hiloUUID={tesis.hilo.uuid} enableDocs={false}/>
      </Box>
      <Box
        sx={{
          gridRow: "1",
          gridColumn: "span 6",
          display: "grid",
          gridAutoColumns: "1fr",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Typography variant={"h5"} sx={{ gridRow: "1", gridColumn: "span 9" }}>
          Detalle de Propuesta de Tesis
        </Typography>
        {user.rolActual === "alumno" && esAlumno===false &&
        <Button 
          color="warning"  
          sx={{ gridRow: "1", gridColumn: "span 3", justifySelf: "end" }}
          startIcon={<MailOutlineIcon/>} 
          onClick={handleClickOpen}
          >
            Solicitar Tema Propuesto
        </Button>
        }
        {(userHasRoles(user, ["COORDINADOR"]) ||
            (tesis.proponiente.idUsuario === user.idUsuario && ["asesor", "alumno"].includes(user.rolActual))) && (
          <Button
            variant="contained"
            size={"small"}
            onClick={handleGuardarTesis}
            sx={{ gridRow: "1", gridColumn: "span 3", justifySelf: "end" }}
          >
            {" "}
            Guardar Cambios
          </Button>
        )}
        <TextField
          label="Titulo"
          variant="outlined"
          name="titulo"
          fullWidth={true}
          size={"small"}
          value={tesis.titulo}
          onChange={handleTesisChange}
          InputLabelProps={{ shrink: true }}
          // solo el proponiente puede editar, ya sea alumno o asesor
          disabled={!(tesis.proponiente.idUsuario === user.idUsuario && ["asesor", "alumno"].includes(user.rolActual))}
          sx={{ gridRow: "2", gridColumn: "span 12" }}
        />
        <TextField
          label="Descripcion"
          variant="outlined"
          name="descripcion"
          margin="dense"
          fullWidth={true}
          multiline={true}
          rows={8}
          size={"small"}
          value={tesis.descripcion}
          onChange={handleTesisChange}
          disabled={!(tesis.proponiente.idUsuario === user["idUsuario"] && ["asesor", "alumno"].includes(user.rolActual))}
          InputLabelProps={{ shrink: true }}
          sx={{ gridRow: "3", gridColumn: "span 12" }}
        />
        <TextField
            label="Detalles adicionales"
            variant="outlined"
            name="detallesAdicionales"
            margin="dense"
            fullWidth={true}
            multiline={true}
            rows={8}
            size={"small"}
            value={tesis.detallesAdicionales}
            onChange={handleTesisChange}
            disabled={!(tesis.proponiente.idUsuario === user["idUsuario"] && ["asesor", "alumno"].includes(user.rolActual))}
            InputLabelProps={{ shrink: true }}
            sx={{ gridRow: "4", gridColumn: "span 12" }}
        />
        <TextField
            label="Area"
            name="idAreaEsp"
            variant="outlined"
            fullWidth
            select
            size={"small"}
            value={areaState.id}
            margin="dense"
            onChange={event => setAreaState({...areaState, id: event.target.value})}
            disabled={!(tesis.proponiente.idUsuario === user["idUsuario"] && ["asesor", "alumno"].includes(user.rolActual))}
            sx={{ gridRow: "5", gridColumn: "span 4" }}
        >
          {
            areaState.areas.map(area => {
              return (
                  <MenuItem key={area["id"]} value={area["id"]}>
                    {area["nombre"]}
                  </MenuItem>
              )
            })
          }
        </TextField>
        <TextField
          label="Proponente"
          name="proponiente"
          margin="dense"
          variant="outlined"
          fullWidth
          size={"small"}
          value={`${tesis.proponiente.nombre} ${tesis.proponiente.apellido}`}
          disabled
          InputLabelProps={{ shrink: true }}
          sx={{ gridRow: "5", gridColumn: "span 4" }}
        />
        <TextField
          value={tesis.estado}
          select
          label="Estado"
          margin="dense"
          variant="outlined"
          size={"small"}
          fullWidth
          onChange={event => {setTesis({ ...tesis, estado: event.target.value })}}
          sx={{ gridRow: "5", gridColumn: "span 4" }}
          disabled={!(user["rolActual"] === "coordinador" && user["idUsuario"] !== tesis.proponiente.idUsuario)}
        >
          <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
          <MenuItem value="OBSERVADO">OBSERVADO</MenuItem>
          <MenuItem value="APROBADO">APROBADO</MenuItem>
        </TextField>
        { (tesis.estado === "APROBADO" && ["coordinador", "profesor"].includes(user.rolActual)) &&
        <Button
            component={Link}
            to="inscritos"
            state={tesis.id}
            sx={{gidRow: 6, gridColumn: "span 12", justifySelf: "flex-end"}}
        >
          Modificar Inscritos
        </Button>
        }
      </Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">
         {"SOLICITUD DE TEMA DE TESIS"}
         </DialogTitle>
         <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <b>Estimado(a) alumno(a): </b>          
          <br></br>
          Debe enviar un correo al asesor {tesis.proponiente.nombre} {tesis.proponiente.apellido} indicando los motivos por los cuales desea este tema de tesis.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}> 
          <a
            href={correoAsesor}
            target="_blank"
            rel="noopener noreferrer"
            >
          Enviar correo 
          </a>
          </Button>
        </DialogActions>
        </Dialog>   
    </Box>
    
  );
};

export default DetallePlanTesis;
