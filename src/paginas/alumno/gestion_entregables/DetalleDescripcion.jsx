// @flow
import * as React from "react";
import type {TareaEntrega} from "../../general/DovahTypes";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

const DetalleDescripcion = ({tareaEntrega}: {tareaEntrega: TareaEntrega | null}): React.Node => {
    if (tareaEntrega == null) return <></>;

    if (tareaEntrega.tarea.descripcion === "") return <></>;

    return (
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1}}>
            <Typography sx={{gridRow: 1, gridColumn: "span 12"}} variant="h5">
                Descripción
            </Typography>
            <Typography sx={{gridRow: 2, gridColumn: "span 12"}} gutterBottom>
                {tareaEntrega.tarea.descripcion}
            </Typography>
        </Box>
    )
}

export default DetalleDescripcion;