// @flow
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as React from "react";
import axios from "axios";
import {useAuth} from "../../../componentes/Context";
import {userHasRoles} from "../../general/utils";
import {Box} from "@mui/material";

type FormState = {
    usuarioId: number | string,
    rol: string
}

type Inscritos = {
    id: number,
    rol: {
        nombre: string
    },
    usuario: {
        idUsuario: number,
        nombre: string,
        apellido: string,
        codigoPUCP: string
    }
}

const ModificarTesisInscritos = ({inscritos, setInscritos}: {inscritos: [] | [Inscritos], setInscritos: Function}): React.Node => {
    const {user} = useAuth();
    const [formState, setFormState] = React.useState({
        usuarioId: "",
        rol: ""
    });
    const [roles, setRoles] = React.useState([]);
    const [users, setUsers] = React.useState([]);


    const handleFormChange = (event: SyntheticInputEvent<>) => {
        let state: FormState = {...formState};
        state[event.target.name] = event.target.value;
        if (event.target.name === "usuarioId") state.rol = "";
        setFormState(state);
    }

    const handleNuevoUsuario = (event: SyntheticMouseEvent<>) => {
        event.preventDefault();
        const usrTable = inscritos.find(e => e["usuario"]["idUsuario"] === formState.usuarioId);
        if (typeof usrTable !== "undefined") return;
        const usr = users.find(usr => usr["idUsuario"] === formState.usuarioId);
        if (typeof usr !== "undefined") {
            setInscritos([...inscritos, {
                id: 0,
                rol: {
                    nombre: formState.rol
                },
                usuario: usr
            }]);
        }
    }

    React.useEffect(() => {
        const especialidad = user["especialidad"]["idEspecialidad"];
        axios.get(`/usuario/especialidad/${especialidad}/roles/exist`)
            .then(response => setUsers(response.data));
    }, [])

    React.useEffect(() => {
        const usr = users.find(usr => usr["idUsuario"] === formState.usuarioId);
        if (typeof usr !== "undefined") {
            const rolArr = usr["listaRoles"];
            setRoles(rolArr);
        }
    }, [formState.usuarioId])

    if (!userHasRoles(user, ["COORDINADOR"])) return <></>;

    return (
        <Box sx={{display: "grid", gridAutoColumns: '1fr', gap: 1}}>
            <TextField
                value={formState.usuarioId}
                select
                size={"small"}
                label="Usuario"
                SelectProps={{
                    value: formState.usuarioId,
                    name: "usuarioId",
                    onChange: handleFormChange
                }}
                sx={{gridRow: '1', gridColumn: 'span 4'}}
            >
                {
                    users.map((usr) => {
                        return (
                            <MenuItem key={usr["idUsuario"]} value={usr["idUsuario"]}>
                                {`${usr["nombre"]} ${usr["apellido"]}`}
                            </MenuItem>
                        )
                    })
                }
            </TextField>
            <TextField
                select
                name="rol"
                size={"small"}
                value={formState.rol}
                onChange={handleFormChange}
                label="Rol"
                sx={{gridRow: '1', gridColumn: 'span 4'}}
            >
                {
                    roles.map((ele) => {
                        return (
                            <MenuItem key={ele["idRol"]} value={ele["nombre"]}>
                                {`${ele["nombre"]}`}
                            </MenuItem>
                        )
                    })
                }
            </TextField>
            <Button
                sx={{gridRow: '1', gridColumn: 'span 4', justifySelf: "start"}}
                size={"small"}
                variant="contained" onClick={handleNuevoUsuario}>Agregar Usuario</Button>
        </Box>
    )
}

export default ModificarTesisInscritos;