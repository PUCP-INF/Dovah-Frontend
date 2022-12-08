import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import * as uuid from "uuid";
import axios from "axios";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExportContainer,
    GridToolbarExport,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridCsvExportMenuItem,
    GridColumns
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {Box, Button, MenuItem, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import {PlanTesis} from "../../general/DovahTypes";
import { useAuth } from "../../../componentes/Context";

const ListarPlanTesis = (): JSX.Element => {
    const [planTesis, setPlanTesis] = React.useState<Array<PlanTesis>>([]);
    const [periodoState, setPeriodoState] = React.useState({
        periodos: [],
        periodoId: ""
    });
    const { user } = useAuth();
    const handlePeriodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodoState({...periodoState, periodoId: event.target.value});
    }

    // @ts-ignore
    const GridToolbarExport = ({ csvOptions, ...other }) => (
        <GridToolbarExportContainer {...other}>
          <GridCsvExportMenuItem options={csvOptions} />
        </GridToolbarExportContainer>
    );

    const columns: GridColumns<PlanTesis> = [
        {
            field: "proponiente",
            headerName: "Proponente",
            sortable: false,
            flex: 0.2,
            valueGetter: params => {
                return `${params.value["nombre"]} ${params.value["apellido"]}`;
            }
        },
        {
            field: "titulo",
            headerName: "Titulo",
            sortable: false,
            flex: 0.3
        },
        {
            field: "descripcion",
            headerName: "Descripcion",
            sortable: false,
            flex: 0.9
        },
        {
            field: "areaEspecialidad",
            headerName: "Area",
            sortable: false,
            flex: 0.2,
            valueGetter: params => {
                return params.value["nombre"]
            }
        },
        {
            field: "estado",
            headerName: "Estado",
            sortable: false,
            flex: 0.2
        },
        {
            field: "id",
            headerName: "Acciones",
            sortable: false,
            flex: 0.2,
            renderCell: params => {
                return <Button component={Link} to={"../detalle"} state={{id: params.value}}>Detalle</Button>
            }
        }
    ]

    React.useEffect(() => {
        axios.get("/planTesis/getAllPeriodos")
            .then(response => {
                setPeriodoState({...periodoState,
                    periodos: response.data,
                    periodoId: response.data[0]["id"]
                })
            });
    }, []);

    React.useEffect(() => {
        showData();

    }, [periodoState.periodoId]);
    
    const showData= async ()=>{
        if (periodoState.periodoId === "") return;
        const datos = await axios.get(`/planTesis/porPeriodo/${periodoState.periodoId}`);
        console.log("datos",datos);
        const idEspecialidad = user["especialidad"]["idEspecialidad"];
        const arreglo=[];
        for (let i=0;i<datos.data.length;i++){
            if(idEspecialidad===datos.data[i]["areaEspecialidad"]["especialidad"]["idEspecialidad"]){
                arreglo.push(datos.data[i]);
            }
        }
        setPlanTesis(arreglo);
    }
    return (
        <>
        <div className="pb-6 mt-6 grid grid-cols-1">
                <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                    Lista de Proyectos de Tesis
                </p>
            </div>
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField
                        label={"Periodo"}
                        size={"small"}
                        select
                        fullWidth
                        value={periodoState.periodoId}
                        name={"periodo"}
                        onChange={handlePeriodoChange}
                    >
                        {
                            periodoState.periodos.map((value) => {
                                const fechaIni = dayjs(value["fechaInicio"]);
                                const fechaFin = dayjs(value["fechaFin"]);
                                const dateStr = fechaIni.format("DD/MM/YY") + " - " + fechaFin.format("DD/MM/YY");
                                return (
                                    <MenuItem key={value["id"]} value={value["id"]}>{dateStr}</MenuItem>
                                )
                            })
                        }
                    </TextField>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{ height: 500, width: '100%' ,marginTop: 1, marginBottom:6 }} key={uuid.v4()}>
                        <DataGrid
                        sx={{
                            '@media print': {
                              '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                            },
                          }}

                            rows={planTesis}
                            columns={columns}
                            components={{Toolbar:()=>{
                                return <GridToolbarContainer>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarFilterButton />

                                    <GridToolbarExport
                                      csvOptions={{
                                        fileName: "Lista de Proyectos de Tesis",
                                        delimiter: ';',
                                        includeHeaders: true,
                                        utf8WithBom: true,
                                      }}/>
                                </GridToolbarContainer>
                            }}}
                            pagination={true}
                            disableSelectionOnClick={true}
                            experimentalFeatures={{ newEditingApi: true }}
                            autoPageSize
                            getRowHeight={() => 'auto'}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
};

export default ListarPlanTesis;