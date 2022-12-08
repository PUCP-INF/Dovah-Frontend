import * as React from "react";
import {Box, Button, MenuItem, TextField} from "@mui/material";
import {DataGrid, GridColDef, GridValueGetterParams, GridToolbar,
  GridToolbarContainer, GridToolbarExportContainer,GridToolbarExport,
  GridToolbarColumnsButton,GridToolbarFilterButton,GridCsvExportMenuItem,
  GridPrintExportMenuItem} from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import * as uuid from "uuid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement);

const ReporteDeEntregables = (props): React.Node =>{
  const[probando,setProbando]=React.useState("");
  const columns: GridColDef[] = [
    {
      field: 'codigo',
      headerName: 'Código PUCP',
      sortable: true,
      flex: 0.15,
      valueGetter: (params:GridValueGetterParams) => {
        return `${params.row["usuario"]["codigoPUCP"]}`;
      }
    },
    {
      field: 'alumno',
      headerName: 'Alumno',
      sortable: true,
      flex: 0.35,
      valueGetter: (params:GridValueGetterParams) => {
        return `${params.row["usuario"]["apellido"]}, ${params.row["usuario"]["nombre"]}`;
      }
    },
    {
      field: 'correo',
      headerName: 'Correo',
      sortable: true,
      flex: 0.3,
      valueGetter: (params:GridValueGetterParams) => {
        return `${params.row["usuario"]["correo"]}`;
      }
    },
    {
      field: 'nota',
      headerName: 'Nota',
      sortable: true,
      flex: 0.1,
      valueGetter: (params:GridValueGetterParams) => {
        if(params.row["curso"] !== NaN){
          return `${params.row["curso"]}`;
        }else{
          return `-`;
        }
      }
    },
  ];
  
  const labels = ['0', '1', '2', '3', '4', '5', '6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
  const labPie = ['Aprobados', 'Desaprobados'];
  const [prueba,setPrueba] =React.useState([]);
  const [pruebaPie, setPruebaPie] =React.useState([]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '['+props.claveCurso +'] '+'Notas Parciales de '+props.nombreCurso + ' - ' + probando,
      },
    },
  };

  const dataNota = {
    labels,
    datasets: [
      {
        label: 'Cant. de alumnos',
        data: prueba,
        borderColor: 'rgba(58, 160, 235, 1)',
        backgroundColor: 'rgba(58, 160, 235, 0.8)',
      },
    ],
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Aprobados vs Desaprobados',
      },
      legend: {
        position:'bottom',
        display: true,
      },
    },
  };

  const dataPie = {
    labels: labPie,
    datasets: [
      {
        label: 'Cant. de alumnos',
        data: pruebaPie,
        backgroundColor: [
          'rgba(15, 199, 101, 0.7)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(15, 199, 101, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const [tarea, setTarea] =React.useState({
    tareas2:[],
    tareaId: ""
  });

  const [alumnos, setAlumnos] = React.useState([]);
  const handlePeriodoChange = (event: SyntheticInputEvent<>) => {
    setTarea({...tarea, tareaId: event.target.value});
  }

  const idCurso = props.idCurso;
  const GridToolbarExport = ({ csvOptions, ...other }) => (
    <GridToolbarExportContainer {...other}>
      <GridCsvExportMenuItem options={csvOptions} />
    </GridToolbarExportContainer>
  );
  React.useEffect(() => {
    axios.get(`/tareas/tareasVisibles/${idCurso}`)
        .then(response => {
            setTarea({...tarea,
                tareas2: response.data,
                tareaId: response.data[0]["id"]
            })
        });
}, []);

React.useEffect(() => {
  showData();    
}, [tarea.tareaId]);


  const showData = async() => {
  const numbers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const resumen = [0,0];
  if (tarea.tareaId === "") return;
  console.log("tareaaaa",tarea.tareaId);
  const name = await axios.get(`/tareas/${tarea.tareaId}`);
  const tareaNombre = name.data.nombre;
  setProbando(tareaNombre);
  const response = await axios.get(`/coordinador/curso/${idCurso}/listar/alumno`); 
  
  let alumno = {
    nombre: "",
    apellido: "",
    codigoPUCP: "",
    correo: "",
    id: 0,
    nota:0,
  };
    for( let i=0; i<response.data.length; i++){
      const tareasRevisadas = await axios.get(`/tareas/entregas/${response.data[i].id}`);
      response.data[i]["curso"] = obtenerNotaFinal(response.data[i]["id"], tarea.tareaId, tareasRevisadas.data);
      const variable = response.data[i]["curso"];
      variable.toFixed(2);
      const variable2 = Math.round(variable);
      response.data[i]["curso"]=variable2;
      numbers[variable2]=numbers[variable2]+1;
      if(variable2 > 10){
        resumen[0] = resumen[0]+1;
      }else{
        resumen[1] = resumen[1]+1;
      }
    }    
    setAlumnos(response.data);
    setPrueba(numbers);
    setPruebaPie(resumen);
    console.log("resultado del curso",resumen);
  };
  const obtenerNotaFinal = (idAlumno, tareaId, tareasRevisadas) => {
    let nota=0;
      for (let j=0; j < tareasRevisadas.length; j++){
        if(tareasRevisadas[j].tarea.id === tareaId) {
          nota = tareasRevisadas[j].notaFinal;
          break;
        }
      }
    return nota;
  };


  const buscarNota = (idAlumno, idTarea,tareaAlumnos) => {
    let nota=0;
    let pesos = 0;
    for( let i=0; i<tareaAlumnos.length; i++){
      if(idTarea===tareaAlumnos[i]["id"]){
        nota = tareaAlumnos[i]["nota_final"];
        break;
      }
    } 
    return nota;
  };

  return (
    <div name="reportedeentregables" className="h-screen-pucp flex overflow-x-hidden overflow-y-auto bg-white">
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <Grid container spacing={2}>
        <Grid xs={14}>
                    <TextField
                        label={"Tareas"}
                        size={"small"}
                        select
                        fullWidth
                        value={tarea.tareaId}
                        name={"tarea"}
                        onChange={handlePeriodoChange}
                    >
                        {
                            tarea.tareas2.map((value) => {
                                const nombreTarea2 = value.nombre;
                                return (
                                    <MenuItem key={value["id"]} value={value["id"]}>{nombreTarea2}</MenuItem>
                                )
                            })
                        }
                    </TextField>
        </Grid>

            <Grid xs={12}>
                <Box sx={{ height: 500, width: '100%' }} key={uuid.v4()}>
                  <DataGrid
                  sx={{
                      '@media print': {
                        '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                      },
                    }}
                      
                      rows={alumnos}
                      columns={columns}                      
                      components={{Toolbar:()=>{
                          return <GridToolbarContainer>
                              <GridToolbarColumnsButton />
                              <GridToolbarFilterButton />

                              <GridToolbarExport
                                csvOptions={{
                                  fileName: props.claveCurso+" ["+ props.anho + "-" + props.periodo +"] - Reporte de "+ probando,
                                  delimiter: ';',
                                  includeHeaders: true,
                                  utf8WithBom: true,
                                }}/>
                          </GridToolbarContainer>
                      }}}
                      pageSize={20}
                      pagination={true}
                      disableSelectionOnClick={true}
                      experimentalFeatures={{ newEditingApi: true }}
                      autoPageSize
                      getRowHeight={() => 'auto'}
                  />
                </Box>
            </Grid>
          </Grid>
          <div className="h-10"></div>
          <div className="flex flex-row space-x-4">
            <div className="w-2/3 border-2">       
              <div className="mx-2">
                <Bar options={options} data={dataNota} /> 
              </div>      
            </div>
            <div className="w-1/3 border-2">
              <Pie data={dataPie} options={optionsPie} /> 
            </div>             
          </div>
    </div>
  </div>
  );
};

export default ReporteDeEntregables
