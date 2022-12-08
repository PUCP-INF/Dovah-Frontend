import React from "react";
import {
    Box,
    Button,Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Link,
    TextField
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import {eliminarDocumentoEntrega} from "../../../services/TareaServices";
import {eliminarArchivo} from "../../../services/DocumentoServices";
import {useAuth} from "../../../componentes/Context";
import {useState} from "react";
import type {NuevoDocumento, TareaEntrega, Usuario} from "../../general/DovahTypes";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Stack from "@mui/material/Stack";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {EstadoEntrega} from "../../general/DovahTypes";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from '@mui/icons-material/Delete';
import {subirDocumento} from "../../general/utils";

const DetalleEntrega = (
    {tareaEntrega, reload}
        : {tareaEntrega: TareaEntrega | null, reload: Function}): JSX.Element => {
    const {user}: {user: Usuario} = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nuevoDocumento, setNuevoDocumento] = React.useState<NuevoDocumento>({
        nombre: "",
        file: null,
    });
    const [editarEntrega, setEditarEntrega] = React.useState<boolean>(false);

    const addDocumento = async () => {
        if (tareaEntrega == null) return;
        if (nuevoDocumento.file == null) return;
        setLoading(true);
        const doc = await subirDocumento(nuevoDocumento.file, nuevoDocumento.nombre);
        const json = {
            idTareaEntrega: tareaEntrega.id,
            idDocumento: doc.id
        };
        await axios.post("/tareas/agregarDocumentoTareaEntrega", json);
        await reload();
        modalInsertar();
        setLoading(false);
    };

    const deleteDocumento = async (id: number) => {
        if (tareaEntrega == null) return;
        const json = {
            idTareaEntrega: tareaEntrega.id,
            idDocumento: id
        };
        await eliminarDocumentoEntrega(json);
        await eliminarArchivo(id);
        await reload();
    };

    /*Insertar Documento*/
    const modalInsertar = () => {
        setNuevoDocumento({file: null, nombre: ""});
        setOpen(!open);
    };

    const handleInputChange2=(event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setNuevoDocumento({...nuevoDocumento, nombre: event.currentTarget.value});
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files == null) return;
        const file: File = event.currentTarget.files[0];
        setNuevoDocumento({file: file, nombre: file.name});
    };

    const toggleVistoBueno = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (tareaEntrega == null) return;
        const target = event.target as HTMLInputElement;
        const json = {
            idTareaEntrega: tareaEntrega.id,
            vistoBueno: target.checked
        }
        await axios.post("/tareas/entrega/modificarVistoBueno", json);
        await reload();
    }

    if (tareaEntrega == null) return <></>;

    if (tareaEntrega.tarea.esExposicion) return <></>;

    const necesitaVistoBueno = tareaEntrega.tarea.necesitaVistoBueno;

    return (
        <Box sx={{display: "grid", gridAutoColumns: "1fr"}}>
            <Stack sx={{gridColumn: "span 12", gridRow: 1}}
                   direction="row" spacing={2} justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Typography variant="h5">
                    Entrega
                </Typography>
                {(user.idUsuario === tareaEntrega.alumno.usuario.idUsuario) && tareaEntrega.estadoEntrega !== EstadoEntrega.finalizada && (
                    <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                        {!editarEntrega && (
                            <Button onClick={() => setEditarEntrega(true)}>
                                Modificar entrega
                            </Button>
                        )}
                        {editarEntrega && (
                            <>
                                <Button onClick={() => setEditarEntrega(false)}>
                                    Guardar entrega
                                </Button>
                                <Button onClick={() => modalInsertar()}>
                                    Agregar archivos
                                </Button>
                            </>
                        )}
                    </Stack>
                )}
                {necesitaVistoBueno && user.rolActual === "asesor" && (
                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox
                                checked={tareaEntrega.vistoBueno}
                                onClick={event => toggleVistoBueno(event)}
                                inputProps={{ 'aria-label': 'controlled'}}/>
                        } label="Visto Bueno"/>
                    </FormGroup>
                )}
            </Stack>

            { tareaEntrega.listaDocumentos.length === 0 &&
                <Typography sx={{gridColumn: "span 12", gridRow: 2}}>
                    Todavía no has realizado una entrega
                </Typography>
            }

            <Box sx={{gridColumn: "span 12", gridRow: 3, display: "grid", gridAutoColumns: "1fr"}}>
                <Stack spacing={2}>
                    {
                        tareaEntrega.listaDocumentos.map((doc) => {
                            return (
                                <Stack key={doc.id} direction="row" justifyContent="flex-start" alignItems="center">
                                    {editarEntrega && (
                                        <IconButton onClick={() => deleteDocumento(doc.id)}>
                                            <DeleteIcon color="error" fontSize="small"/>
                                        </IconButton>
                                    )}
                                    <Typography>
                                        <Link href={doc.url} target="_blank" display="flex" alignItems="center" flexWrap="wrap">
                                            <AttachmentIcon/> {doc.nombre}
                                        </Link>
                                    </Typography>
                                </Stack>
                            )
                        })
                    }
                </Stack>
            </Box>
            {/*Inicio de modal*/}
            <Dialog
                open={open}
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle>Nuevo Documento</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} justifyContent="flex-start" alignItems="flex-start">
                        <TextField
                            required
                            margin="normal"
                            name="nombre"
                            id="idNombre"
                            label="nombreDocumento.extension"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={nuevoDocumento.nombre}
                            onChange={handleInputChange2}
                        />
                        <Button startIcon={<AttachFileIcon/>} component="label" variant="text">
                            Adjuntar Archivo
                            <input onChange={handleInputChange} hidden accept="*/*" type="file"/>
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={2}>
                        <Button
                            startIcon={<CancelIcon/>}
                            color="error"
                            variant="contained"
                            onClick={() => modalInsertar()}>
                            Cancelar
                        </Button>
                        <LoadingButton
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<CheckIcon/>}
                            component="label"
                            variant="contained"
                            onClick={() => addDocumento()}
                        >
                            Guardar
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DetalleEntrega;