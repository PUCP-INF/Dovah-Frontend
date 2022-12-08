import React from "react";
import {Autocomplete, Box, Button, Checkbox, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridToolbarContainer,
    GridToolbarQuickFilter
} from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useSnackbar } from 'notistack'
import {Alumno, Curso, Profesor, Usuario} from "./DovahTypes";
import {useAuth} from "../../componentes/Context";

interface UsuariosOtroCurso {
    usuarios: Array<Usuario>,
    usuario: Usuario | null
}

const CustomToolbar = (): JSX.Element => {
    return (
        <GridToolbarContainer>
            <GridToolbarQuickFilter debounceMs={250}/>
        </GridToolbarContainer>
    )
}

const GestionUsuarios = ({tipoUsuario}: {tipoUsuario: string}): JSX.Element => {
    const location = useLocation();
    const {user} = useAuth();
    const curso: Curso = location.state;
    const emptyUser = {
        nombre: "",
        apellido: "",
        codigoPUCP: "",
        password: "",
        correo: "",
        idUsuario: 0
    } as Usuario;

    const [usuarios, setUsuarios] = React.useState<Array<Alumno | Profesor>>([]);
    const [loading, setLoading] = React.useState(false);
    const [usuario, setUsuario] = React.useState<Usuario>({...emptyUser} as Usuario);
    const [idSelect, setIdSelect] = React.useState(0);
    const [usuariosOtrosCurso, setUsuariosOtrosCurso] = React.useState<UsuariosOtroCurso>({
        usuarios: [],
        usuario: null
    });

    const [rolesEncargados, setRolesEncargados] = React.useState(new Set());
    const { enqueueSnackbar } = useSnackbar();

    let str = "Nuevo";
    if (usuario["idUsuario"] !== 0) str = "Modificar";

    /*Manejo de validaciones */
    const [errorNombreUsuarioValue, setErrorNombreUsuarioValue] =React.useState(false);
    const [errorNombreUsuarioText, setErrorNombreUsuarioText] = React.useState("");
    const [errorApellidoUsuarioValue, setErrorApellidoUsuarioValue] = React.useState(false);
    const [errorApellidoUsuarioText, setErrorApellidoUsuarioText] = React.useState("");
    const [errorCodigoPUCPUsuarioValue, setErrorCodigoPUCPUsuarioValue] = React.useState(false);
    const [errorCodigoPUCPUsuarioText, setErrorCodigoPUCPUsuarioText] = React.useState("");
    const [errorCorreoValue, setErrorCorreoValue] = React.useState(false);
    const [errorCorreoText, setErrorCorreoText] = React.useState("");

    async function correoUnico(correo: String){
        
        const response = await axios.get(`/coordinador/curso/${curso["idCurso"]}/listar/${tipoUsuario}`);
        const datos = response.data;
        console.log("Tipo usuario: ", tipoUsuario);
        console.log("Curso id: ", curso["idCurso"] );
        console.log("Correo unico: ", datos);
        let flag = true;
        datos.map( (d: any) => {
            console.log("correo-",correo);
            console.log("user",d.usuario.correo);
            if (correo === d.usuario.correo && flag){
                console.log("IGUALITOOOOS")
                flag = false;
            
            }
        })
        return flag;
    }
    async function codigoUnico(codigo: String){
        const response = await axios.get(`/coordinador/curso/${curso["idCurso"]}/listar/${tipoUsuario}`);
        const datos = response.data;
        console.log("Tipo usuario: ", tipoUsuario);
        console.log("Curso id: ", curso["idCurso"] );
        console.log("Codigo unico: ", datos);
        let flag = true;
        datos.map( (d: any) => {
            console.log("codigo-",codigo);
            console.log("user",d.usuario.codigoPUCP);
            if (codigo === d.usuario.codigoPUCP && flag){
                console.log("IGUALITOOOOS CODIGOS XD")
                flag = false;
            
            }
        })
        return flag;

    }
    function validarNombre() {
        //linea que solo acepta strings que contiene caracteres (incluido mayusculas) y no es vacio
        let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
        let cadena = usuario.nombre.trim();
        
        if (cadena === "") {
          setErrorNombreUsuarioText("El nombre ingresado no debe ser vacío.");
          setErrorNombreUsuarioValue(true);
          return false;
        } else if (!regex.test(usuario.nombre)) {
          setErrorNombreUsuarioText(
            "El nombre no debe contener números"
          );
          setErrorNombreUsuarioValue(true);
          return false;
        } else if (usuario.nombre.length >= 40) {
          setErrorNombreUsuarioText(
            "El nombre no puede contener más de 40 caracteres."
          );
          setErrorNombreUsuarioValue(true);
          return false;
        } else {
          console.log("TODO OK NOMBRE");
          setErrorNombreUsuarioText("");
          setErrorNombreUsuarioValue(false);
          return true;
        }
      }
    

      function validarApellido() {
        //linea que solo acepta strings que contiene caracteres (incluido mayusculas) y no es vacio
        let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
        let cadena = usuario.apellido.trim();
    
        if (cadena === "") {
          setErrorApellidoUsuarioText("El apellido ingresado no debe ser vacío.");
          setErrorApellidoUsuarioValue(true);
          return false;
        } else if (!regex.test(usuario.apellido)) {
          setErrorApellidoUsuarioText(
            "El apellido no puede contener caracteres especiales."
          );
          setErrorApellidoUsuarioValue(true);
          return false;
        } else if (usuario.apellido.length >= 40) {
          setErrorApellidoUsuarioText(
            "El apellido no puede contener más de 40 caracteres."
          );
          setErrorApellidoUsuarioValue(true);
          return false;
        } else {
          console.log("TODO OK APELLIDO");
          setErrorApellidoUsuarioText("");
          setErrorApellidoUsuarioValue(false);
          return true;
        }
      }
    
      async function validarCorreo() {
        let regex = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
        let cadena = usuario.correo.trim();
        
        if (cadena === "") {
          setErrorCorreoText("Correo no puede ser vacío.");
          setErrorCorreoValue(true);
          return false;
        } else if (!regex.test(usuario.correo)) {
          setErrorCorreoText(
            "Ingrese un correo válido"
          );
          setErrorCorreoValue(true);
          return false;
        } else {
          console.log("TODO OK Correo");
          if (await correoUnico(usuario.correo)){
            setErrorCorreoText("");
            setErrorCorreoValue(false);
            return true;
          } 
          else{
                setErrorCorreoText("Este correo ya existe");
                setErrorCorreoValue(true);
                return false;
          }
        }
      }

     async function validarCodigoPUCP() {
        let regex = new RegExp("^[0-9]*$");
        let cadena = usuario.codigoPUCP.trim();
    
        if (cadena === "") {
          setErrorCodigoPUCPUsuarioText("El código PUCP ingresado no debe ser vacío.");
          setErrorCodigoPUCPUsuarioValue(true);
          return false;
        } else if (!regex.test(usuario.codigoPUCP)) {
          setErrorCodigoPUCPUsuarioText(
            "El código PUCP solo admite números del 1-9."
          );
          setErrorCodigoPUCPUsuarioValue(true);
          return false;
        } else if (usuario.codigoPUCP.length < 8 ||  usuario.codigoPUCP.length > 8 ) {
          setErrorCodigoPUCPUsuarioText(
            "El código PUCP debe contener 8 números."
          );
          setErrorCodigoPUCPUsuarioValue(true);
          return false;
        } else {

            console.log("TODO OK codigo PUCP");
            if (await codigoUnico(usuario.codigoPUCP)){
                setErrorCodigoPUCPUsuarioText("");
                setErrorCodigoPUCPUsuarioValue(false);
                return true;
            }
            else{
                setErrorCodigoPUCPUsuarioText("Este codigo ya existe");
                setErrorCodigoPUCPUsuarioValue(true);
                return false;
          }

        }
      }

    const columns: GridColumns<Alumno | Profesor> = [
        {
            field: "nombre",
            headerName: 'Nombre',
            flex: 1,
            valueGetter: params => {
                const usr = params["row"]["usuario"];
                return usr["nombre"] + " " + usr["apellido"];
            }
        },
        {
            field: "codigo",
            headerName: "Codigo",
            flex: 0.3,
            valueGetter: params => {
                const usr = params["row"]["usuario"];
                return usr["codigoPUCP"];
            }
        },
        {
            field: "correo",
            headerName: "Correo",
            flex: 0.6,
            valueGetter: params => {
                const usr = params["row"]["usuario"];
                return usr["correo"];
            }
        },
        {
            field: "roles",
            headerName: "Roles",
            flex: 1,
            hideable: true,
            valueGetter: params => {
                if (tipoUsuario === "alumno") return "";
                const prof = params.row as Profesor;
                let str = "";
                for (const rol of prof.roles) {
                    str += rol.nombre + " ";
                }
                return str;
            }
        },
        {
            field: "acciones",
            headerName: "Acciones",
            type: "actions",
            flex: 0.3,
            getActions: params => {
                return [
                    <GridActionsCellItem
                        onClick={() => handleUserEdit(params.row)}
                        label="editar"
                        icon={<EditIcon color="primary"/>}
                    />,
                    <GridActionsCellItem
                        onClick={() => handleUserDelete(params.row["id"])}
                        icon={<DeleteIcon color="error"/>}
                        label="Eliminar"
                    />
                ]
            }
        }
    ]

    /*
    - asignar jurado antes/despues
    - los casos en que el asesor no debe corregir, aun asi debe der el visto bueno?
    - mandar correo al profesor
    - visto bueno siempre lo tiene que dar el asesor
     */

    const handleUserDelete = async (id: number) => {
        const json = {
            tipo: tipoUsuario,
            idCurso: curso["idCurso"],
            idAlumno: id,
            idProfesor: id
        }
        await axios.delete("/coordinador/curso/eliminar", {data: json});
        enqueueSnackbar("Eliminación de usuario correcta", {variant: "success"});
        await getUsuarios();
        await getUsuariosOtrosCursos();
    }

    const getUsuarios = async () => {
        const response = await axios.get(`/coordinador/curso/${curso["idCurso"]}/listar/${tipoUsuario}`);
        setUsuarios(response.data);
    }

    const getUsuariosOtrosCursos = async () => {
        const response = await axios.get<Array<Usuario>>
        (`/profesor/listarSinAsignar/${curso.idCurso}/${user.especialidad.idEspecialidad}`);
        setUsuariosOtrosCurso({usuarios: response.data, usuario: null});
    }

    const handleBulkInsert = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files == null) return;
        setLoading(true);
        const file = event.currentTarget.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("idCurso", curso.idCurso.toString());
        await axios.post(`/coordinador/curso/agregar/${tipoUsuario}/bulk`, formData, {
            headers: {
                "Content-type": "multipart/form-data",
            }
        });
        await getUsuarios();
        setLoading(false);
        enqueueSnackbar("Subida realizada correctamente", {variant: "success"});
    }

    const [editando,setEditando] = React.useState(0);

    const handleUserEdit = (row: Profesor | Alumno) => {
        setEditando(1);
        console.log("aqui estoy editando", editando);
        setUsuario({...usuario, ...row.usuario});
        if (tipoUsuario !== "profesor") return;
        const other = row as Profesor;
        setIdSelect(other.id);
        if (typeof other["roles"] !== "undefined") {
            const set = new Set();
            other["roles"].forEach(e => set.add(e["nombre"]));
            setRolesEncargados(set);
        }
    }

    const handleUsuarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsuario({...usuario, [event.target.name]: event.target.value});
    }

    const handleUsuarioSave = async () => {
        let flag1 = validarNombre();
        let flag2 = validarApellido(); 
        let flag4 = true;
        let flag5 = true;
        if(editando===0){
            flag4 = await validarCodigoPUCP();
            flag5 = await validarCorreo();            
        }
        setEditando(0);
        console.log("FLAG5: ", flag5);
        const val = flag1 && flag2 && flag4 && flag5;
        if(!val) return;

        let json;
        if (tipoUsuario === "profesor") {
            json = {
                ...usuario,
                tipo: tipoUsuario,
                idCurso: curso.idCurso,
                idProfesor: idSelect,
                roles: Array.from(rolesEncargados)
            }
        } else {
            json = {
                ...usuario,
                idCurso: curso.idCurso,
                tipo: tipoUsuario
            }
        }
        if (usuario["idUsuario"] === 0) {
            await axios.post("/coordinador/curso/agregar", json);
            setUsuario({...emptyUser})
            setRolesEncargados(new Set());
        } else {
            await axios.post("/coordinador/curso/modificar", json);
        }
        enqueueSnackbar("Cambios guardados correctamente", {variant: "success"});
        await getUsuarios();
        await getUsuariosOtrosCursos();
    }

    const handleEncargadosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rol = event.target.name;
        let tmp = new Set(rolesEncargados);
        if (!tmp.delete(rol)) {
            tmp.add(rol);
        }
        setRolesEncargados(tmp);
    }

    React.useEffect(() => {
        getUsuarios().catch(() => {});
        if (tipoUsuario === "profesor") {
            getUsuariosOtrosCursos().catch();
        }
    }, []);
    
    return (
        <Box sx={{
            display: 'grid',
            gridAutoColumns: '1fr',
            gap: 1,
            marginTop: 1
        }}>
            <Box sx={{gridColumn: 'span 12', gridRow: 1, display: 'grid', gridAutoColumns: '1fr'}}>
                <div className="mt-6 pb-5 mb-4 flex flex-row w-full">
                    <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black">
                        {curso["nombre"]} {">"} {tipoUsuario === "profesor" ? "Gestion de docentes": "Gestion de alumnos"}
                    </p>
                    <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black text-right">
                        {curso["semestre"]["anhoAcademico"]}-{curso["semestre"]["periodo"]}
                    </p>
                </div>
            </Box>
            {tipoUsuario === "profesor" && (
                <Box sx={{gridColumn: "span 12", gridRow: 2, display: "grid"}}>
                    <Typography variant="h6" gutterBottom sx={{gridColumn: "span 12", gridRow: 1}}>
                        Agregar docentes de otros cursos
                    </Typography>
                    <Autocomplete
                        sx={{gridColumn: "span 12", gridRow: 2}}
                        ListboxProps={{style: { maxHeight: '15rem' }}}
                        renderInput={params => {
                            return <TextField
                                {...params}
                                label="Profesores"
                                size="small"
                            />
                        }}
                        options={usuariosOtrosCurso.usuarios}
                        value={usuariosOtrosCurso.usuario}
                        onChange={(event, value) => {
                            if (value == null) return;
                            setUsuariosOtrosCurso({...usuariosOtrosCurso, usuario: value})
                            value.idUsuario = 0;
                            setUsuario({...usuario, ...value});
                        }}
                        getOptionLabel={(option) => {
                            return `${option.nombre} ${option.apellido}`;
                        }}
                    />
                </Box>
            )}
            <Box sx={{gridColumn: 'span 12', gridRow: 3, display: 'grid', gridAutoColumns: "1fr", gap: 1}} component="form">
                <Typography sx={{gridRow: 1, gridColumn: "span 12"}} variant="h6" alignSelf="center">
                    {str} {tipoUsuario === "profesor" ? "docente": "alumno"}
                </Typography>
                <TextField sx={{gridRow: 2, gridColumn: "span 6"}} fullWidth size="small" label="Nombre" margin="dense"
                           autoComplete={"given-name"} value={usuario["nombre"]} name="nombre"
                           error={errorNombreUsuarioValue} helperText={errorNombreUsuarioText} onChange={handleUsuarioChange}/>
                <TextField sx={{gridRow: 3, gridColumn: "span 6"}} fullWidth size="small" label="Apellido" margin="dense"
                           autoComplete={"family-name"} value={usuario["apellido"]} name="apellido"
                           error={errorApellidoUsuarioValue} helperText={errorApellidoUsuarioText} onChange={handleUsuarioChange}/>
                <TextField sx={{gridRow: 3, gridColumn: "span 6"}} fullWidth size="small" label="Correo" margin="dense"
                           autoComplete={"email"} value={usuario["correo"]} name="correo"
                           error={errorCorreoValue} helperText={errorCorreoText} onChange={handleUsuarioChange}/>
                <TextField sx={{gridRow: 2, gridColumn: "span 6"}} fullWidth size="small" label="Codigo" margin="dense"
                           autoComplete={"username"} value={usuario["codigoPUCP"]} name="codigoPUCP"
                           error={errorCodigoPUCPUsuarioValue} helperText={errorCodigoPUCPUsuarioText} onChange={handleUsuarioChange}/>
                <TextField
                    sx={{gridRow: 4, gridColumn: "span 6"}}
                    fullWidth
                    size="small"
                    label="Nueva contraseña"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    margin="dense"
                    onChange={handleUsuarioChange}
                    value={usuario["password"]}
                    helperText="Si se tiene una contraseña vacia, solo sera posible iniciar con google"
                />
                {tipoUsuario === "profesor" &&
                    <FormGroup sx={{gridRow: 4, gridColumn: "span 6", justifyContent: "center"}}>
                        <Stack direction="row" spacing={2} justifyContent={"right"}>
                            <FormControlLabel control={
                                <Checkbox
                                    checked={rolesEncargados.has("PROFESOR")}
                                    onChange={handleEncargadosChange}
                                    inputProps={{ 'aria-label': 'controlled'}}
                                    name="PROFESOR" />
                            } label="Profesor"/>
                            <FormControlLabel control={
                                <Checkbox
                                    checked={rolesEncargados.has("ASESOR")}
                                    onChange={handleEncargadosChange}
                                    inputProps={{ 'aria-label': 'controlled'}}
                                    name="ASESOR" />
                            } label="Asesor"/>
                            <FormControlLabel control={
                                <Checkbox
                                    checked={rolesEncargados.has("JURADO")}
                                    onChange={handleEncargadosChange}
                                    inputProps={{ 'aria-label': 'controlled'}}
                                    name="JURADO" />
                            } label="Jurado"/>
                        </Stack>
                    </FormGroup>
                }
                <Stack sx={{gridRow: 5, gridColumn: "span 12"}} direction="row" spacing={2} justifyContent={"right"}>
                    <Button variant="contained" color="error" onClick={() => {
                        setUsuario({...emptyUser})
                        setRolesEncargados(new Set());
                        setErrorNombreUsuarioValue(false);
                        setErrorNombreUsuarioText("");
                        setErrorApellidoUsuarioValue(false);
                        setErrorApellidoUsuarioText("");
                        setErrorCodigoPUCPUsuarioValue(false);
                        setErrorCodigoPUCPUsuarioText("");
                        setErrorCorreoText("");
                        setErrorCorreoValue(false);
                        setEditando(0);
                    }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleUsuarioSave}>Guardar</Button>
                </Stack>
            </Box>
            <Box sx={{gridColumn: 'span 12', gridRow: 4, display: 'grid', gridAutoColumns: "1fr"}}>
                <Stack sx={{gridRow: 1}} marginBottom={1} direction="row" alignItems="center" spacing={2} >
                    <Typography  variant="h6">
                        {tipoUsuario === "profesor" ? "Lista de docentes": "Lista de alumnos"}
                    </Typography>
                    {tipoUsuario === "alumno" &&
                        <LoadingButton
                            startIcon={<AddIcon/>}
                            loading={loading}
                            loadingPosition="start"
                            variant="contained"
                            component="label"
                        >
                            Insertar de excel
                            <input onChange={handleBulkInsert} hidden accept="*/*" type="file"/>
                        </LoadingButton>
                    }
                </Stack>
                <Box sx={{gridRow: 2, height: 550, marginBottom: 2}}>
                    <DataGrid
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    roles: tipoUsuario === "profesor"
                                },
                            },
                        }}
                        columns={columns}
                        rows={usuarios}
                        disableSelectionOnClick={true}
                        autoPageSize
                        components={{Toolbar: CustomToolbar}}
                    />
                </Box>
            </Box>
        </Box>
        
    )
}

export default GestionUsuarios;