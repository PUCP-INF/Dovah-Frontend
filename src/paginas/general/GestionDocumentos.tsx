import React from "react";
import {useLocation} from "react-router-dom";
import {Curso, Documento} from "./DovahTypes";
import axios from "axios";
import {useAuth} from "../../componentes/Context";
import {DataGrid, GridActionsCellItem, GridColumns} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import {Box, Link} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LoadingButton from "@mui/lab/LoadingButton";
import {subirDocumento} from "./utils";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from "dayjs";

const GestionDocumentos = (): JSX.Element => {
    const location = useLocation();
    const curso: Curso = location.state;
    const {user} = useAuth();
    const [documentos, setDocumentos] = React.useState<Array<Documento>>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const columns: GridColumns<Documento> = [
        {
            field: "nombre",
            headerName: "Nombre",
            flex: 1
        },
        {
            field: "fechaCreacion",
            headerName: "Fecha de Creación",
            flex: 1,
            type: "dateTime",
            valueGetter: params => {
                const dt = dayjs(params.row.fechaCreacion).local();
                return dt.format("DD-MM-YYYY HH:mm:ss");
            }
        },
        {
            field: "acciones",
            headerName: "Acciones",
            type: "actions",
            getActions: params => {
                let arr = [
                    <GridActionsCellItem
                        label="descargar"
                        icon={
                            <Link href={params.row.url} target="_blank">
                                <DownloadIcon color="primary"/>
                            </Link>
                        }
                    />
                ];
                if (["profesor", "coordinador"].includes(user.rolActual)) {
                    arr.push(<GridActionsCellItem
                        onClick={() => handleEliminarDocumento(params.row.id)}
                        icon={<DeleteIcon color="error"/>}
                        label="Eliminar"
                    />)
                }
                return arr;
            }
        }
    ]

    const handleAgregarDocumento = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files == null) return;
        setLoading(true);
        const doc = await subirDocumento(event.currentTarget.files[0]);
        const json = {
            idCurso: curso.idCurso,
            idDocumento: doc.id
        }
        await axios.post(`/curso/agregarDocumentoGeneral`, json);
        await getData();
        setLoading(false);
    }

    const handleEliminarDocumento = async (id: number) => {
        const json = {
            idCurso: curso.idCurso,
            idDocumento: id
        }
        await axios.post("/curso/eliminarDocumentoGeneral", json);
        await getData();
    }

    const getData = async () => {
        const res = await axios.get(`/curso/listarDocumentos/${curso.idCurso}`);
        setDocumentos(res.data);
    }

    React.useEffect(() => {
        getData().catch();
    }, []);

    return (
        <div className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white">
            <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
                <div className="mt-4 mb-4 flex flex-row w-full text-black">
                    <p className="text-3xl font-sans inline border-b-2  flex-auto border-black w-5/6">
                        {`${curso.nombre} > Documentos Generales`}
                    </p>
                    <p className="text-3xl font-sans inline border-b-2  flex-auto border-black text-right w-1/6">
                        {`${curso.semestre.anhoAcademico}-${curso.semestre.periodo}`}
                    </p>
                </div>
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1}} >
            

            {["profesor", "coordinador"].includes(user.rolActual) && (
                <Box sx={{gridColumn: "span 12", gridRow: 2}}>
                    <LoadingButton
                        startIcon={<AttachFileIcon/>}
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                        component="label"
                    >
                        Agregar Documento
                        <input onChange={handleAgregarDocumento} hidden accept="*/*" type="file"/>
                    </LoadingButton>
                </Box>
            )}
            <Box sx={{gridColumn: "span 12", gridRow: 3, height: 500}} marginTop={2}>
                <DataGrid columns={columns} rows={documentos} autoPageSize/>
            </Box>
        </Box>
        </div>
        </div>
    )
}

export default GestionDocumentos;