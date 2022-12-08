import React from "react"
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import CommentBox from "../../general/CommentBox";
import {useAuth} from "../../../componentes/Context";
import type {TareaEntrega} from "../../general/DovahTypes";
import axios from "axios";

const DetalleAvances = ({tareaEntrega, reload}: {tareaEntrega: TareaEntrega | null, reload: Function}): JSX.Element => {
    const {user} = useAuth();

    const avanceUltimaModificacion = async () => {
        if (tareaEntrega == null) return;
        await axios.post(`/tareas/entrega/${tareaEntrega.id}/actualizarAvance`);
        await reload();
    }

    if (!["alumno", "asesor"].includes(user["rolActual"])) return <></>

    if (tareaEntrega == null) return <></>;

    if (tareaEntrega.tarea.esExposicion) return <></>;

    return (
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1}}>
            <Box sx={{gridColumn: "span 12", gridRow: 1}}>
                <Typography variant="h5">
                    Avances
                </Typography>
            </Box>
            <Box sx={{gridColumn: "span 12", gridRow: 2}}>
                <CommentBox hiloUUID={tareaEntrega.avances.uuid} enableDocs={true} callback={avanceUltimaModificacion}/>
            </Box>
        </Box>
    )
}

export default DetalleAvances;