// @flow
import * as React from 'react';
import {Box, Button, TextField} from "@mui/material";
import axios from "axios";
import {useAuth} from "../../../componentes/Context";
import MenuItem from "@mui/material/MenuItem";

const CreacionTesis = (): React.Node => {
    const {user} = useAuth();
    const [formState, setFormState] = React.useState({
        codigoPUCP: user["codigoPUCP"],
        idAreaEsp: ""
    });
    const [areas, setAreas] = React.useState([]);

    const handleClick = async (event: SyntheticMouseEvent<>) => {
        event.preventDefault();
        const response = await axios.post("/planTesis", formState);
        const json = {
            idPlanTesis: response.data["id"],
            idUsuario: user["idUsuario"],
            rol: user["rolActual"].toUpperCase(), // solo asesores puede proponer plan de tesis
        };
        await axios.post("/planTesis/agregarUsuario", json);
    };

    const handleChange = (event: SyntheticInputEvent<>) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    }

    React.useEffect(() => {
        axios.get("/planTesis/areas")
            .then(response => setAreas(response.data));
    }, []);

    return (
        <div className="h-screen w-full bg-white">
            <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
                <div className="flex w-full h-20"></div>
                <p className="text-3xl font-bold inline border-b-4  text-blue-pucp flex-auto border-blue-pucp">
                    Creacion de Tema Tesis
                </p>
                <Box>
                    <TextField
                        label="Titulo"
                        name="titulo"
                        margin="dense"
                        variant="outlined"
                        onChange={handleChange}
                        fullWidth={true}
                    />
                    <TextField
                        label="Descripcion"
                        variant="outlined"
                        name="descripcion"
                        margin="dense"
                        fullWidth={true}
                        multiline={true}
                        rows="10"
                        onChange={handleChange}
                    />
                    <TextField
                        label="Area"
                        name="idAreaEsp"
                        margin="dense"
                        variant="outlined"
                        select
                        fullWidth={true}
                        value={formState.idAreaEsp}
                        onChange={handleChange}
                    >
                        {
                            areas.map(area => {
                                return (
                                    <MenuItem key={area["id"]} value={area["id"]}>
                                        {area["nombre"]}
                                    </MenuItem>
                                )
                            })
                        }
                    </TextField>
                    <div style={{ height: 20 }} />
                    <Button variant="contained" color="success" onClick={handleClick}>Guardar tema tesis</Button>
                    </Box>
            </div>
        </div>
    )
};

export default CreacionTesis;