import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import * as uuid from "uuid";
import axios from "axios";
import {DataGrid, GridColDef, GridToolbar,GridToolbarContainer, GridToolbarExportContainer,GridToolbarExport,GridToolbarColumnsButton,GridToolbarFilterButton,GridCsvExportMenuItem,GridPrintExportMenuItem} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {Box, Button, MenuItem, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import { ConstructionOutlined } from "@mui/icons-material";
import { GridCsvExportOptions } from '@mui/x-data-grid';
import { useAuth } from "../../../componentes/Context";
import { FiRotateCcw } from "react-icons/fi";


const ReporteTesis = (): React.Node => {
    const [planTesis, setPlanTesis] = React.useState([]);
    const [cursoState, setCursoState] = React.useState({
        cursos:[],
        cursoId: 0
    })
    const { user } = useAuth();
    const handlePeriodoChange = (event: SyntheticInputEvent<>) => {
        setCursoState({...cursoState, cursoId: event.target.value});
      }
    const GridToolbarExport = ({ csvOptions, ...other }) => (
        <GridToolbarExportContainer {...other}>
          <GridCsvExportMenuItem options={csvOptions} />
        </GridToolbarExportContainer>
      );
    // $FlowIgnore
    const columns: GridColDef[] = [        
        {
            field: "titulo",
            headerName: "Título",
            sortable: false,
            flex: 0.25
        },
        {
            field: "descripcion",
            headerName: "Descripción",
            sortable: false,
            flex: 0.5
        },
        {
            field: "areaEspecialidad",
            headerName: "Área",
            sortable: false,
            flex: 0.15,
            valueGetter: params => {
                return params.value["nombre"]
            }
        },
        {
            field: "alumnos",
            headerName: "Alumno(s)",
            sortable: false,
            flex: 0.3
        },
        {
            field: "estado",
            headerName: "Estado",
            sortable: false,
            flex: 0.15
        },
    ]    

      React.useEffect(() => {
        showData();
    }, []);
    React.useEffect(() => {
        showData2();
    }, [cursoState.cursoId]);

    const showData= async ()=>{
        const idEspecialidad= user["especialidad"]["idEspecialidad"];  
        const arrCursos = await axios.get(`/curso/ListarPorEspecialidad/${idEspecialidad}`);
        const arregloCursos=[];
        const prueba=[];
        
        for(let p=0;p<arrCursos.data.length;p++){
            let flag2 = false;
            if(arregloCursos.length>0){
                for(let k =0; k<arregloCursos.length; k++){
                    if(arrCursos.data[p]["nombre"] === arregloCursos[k]){
                        flag2 = true;
                        break;
                    }                            
                }
            }
            if(flag2 === false){
                let holi = {
                    idCurso:0,
                    nombre: "",
                }
                arregloCursos.push(arrCursos.data[p]["nombre"]);
                prueba.push(arrCursos.data[p]);
            }
        }
        var tamanio =prueba.length;
        setCursoState({
            ...cursoState,
            cursos: prueba,
            cursoId: prueba[tamanio-1]["idCurso"]
        })

    }
    const showData2= async ()=>{
        if(cursoState.cursoId==="") return;
        const cursoSeleccionado= await axios.get(`/curso/${cursoState.cursoId}`);
        console.log("Curso Seleccionado",cursoSeleccionado);
        const datos = await axios.get(`/planTesis`);
        const idEspecialidad2 = user["especialidad"]["idEspecialidad"];  
        const arreglo=[];
        for (let i=0;i<datos.data.length;i++){
            if(idEspecialidad2===datos.data[i]["areaEspecialidad"]["especialidad"]["idEspecialidad"] && datos.data[i]["estado"]==="APROBADO"){                
                var idPlanTesis = datos.data[i]["id"];
                const inscritos = await axios.get(`/planTesis/listarAlumnosPorPlanTesis/${idPlanTesis}`);
                if(inscritos.data.length > 0){
                    const codigos = [0];
                    datos.data[i]["alumnos"]="";


                        let sustentada=false;
                        for(let j=0; j<inscritos.data.length; j++){
                            let flag = false;
                            for(let k =0; k<codigos.length; k++){
                                if(inscritos.data[j]["usuario"]["codigoPUCP"] === codigos[k]){
                                    flag = true;
                                    break;
                                }                    
                            }
                            if(flag === false){
                                datos.data[i]["alumnos"] =  datos.data[i]["alumnos"] + inscritos.data[j]["usuario"]["nombre"] + " " + inscritos.data[j]["usuario"]["apellido"]+" / ";
                                codigos.push(inscritos.data[j]["usuario"]["codigoPUCP"]);
                            }
                            const cursoLeido =await axios.get(`/curso/${inscritos.data[j]["curso"]}`);
                            if(cursoLeido.data.nombre===cursoSeleccionado.data.nombre){
                                sustentada=true;
                            } 
                        }
                        if(sustentada===false){
                            datos.data[i]["estado"]="EN PROCESO";                    
                            arreglo.push(datos.data[i]);  
                        }else{
                            datos.data[i]["estado"]="POR SUSTENTAR";                    
                            arreglo.push(datos.data[i]); 
                        }
                    }             
                }
            
        }
        setPlanTesis(arreglo);
    };
    return (
        
        <div> 
            <div className="pb-6 mt-6 grid grid-cols-1">
                <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                Reporte de Tesis en proceso y por sustentar
                </p>
            </div>
            <Grid container spacing={2}>
            <Grid xs={14}>
                    <TextField
                        label={"Curso para sustentación de tesis"}
                        size={"small"}
                        select
                        fullWidth
                        value={cursoState.cursoId}
                        name={"cursoState"}
                        onChange={handlePeriodoChange}
                    >
                        {
                            cursoState.cursos.map((value) => {
                                const nombreCurso = value.nombre;
                                return (
                                    <MenuItem key={value["idCurso"]} value={value["idCurso"]}>{nombreCurso}</MenuItem>
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
                                        fileName: "Reporte de Tesis"+" - "+user["especialidad"]["nombre"],
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
        </div>
    );
}
export default ReporteTesis;