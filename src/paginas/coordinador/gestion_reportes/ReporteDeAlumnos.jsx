import * as React from "react";
import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridValueGetterParams, GridToolbar,
  GridToolbarContainer, GridToolbarExportContainer,GridToolbarExport,
  GridToolbarColumnsButton,GridToolbarFilterButton,GridCsvExportMenuItem,
  GridPrintExportMenuItem} from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useAuth } from "../../../componentes/Context";
import * as uuid from "uuid";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReporteDeAlumnos = (props): React.Node =>{


  const columns: GridColDef[] = [
    {
      field: 'codigo',
      headerName: 'Código PUCP',
      sortable: true,
      flex: 0.18,
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
        return `${params.row["usuario"]["apellido"]}, ${params.row["usuario"]["nombre"]} <${params.row["usuario"]["correo"]}>`;
      }
    },
    {
      field: 'tema',
      headerName: 'Tema de tesis',
      sortable: false,
      flex: 0.3,
      valueGetter: (params:GridValueGetterParams) => {
        if(params.row["planTesis"] !== undefined){
          return `${params.row["planTesis"]["titulo"]}`;
        }else{
          return `No tiene tema asignado `;
        }
        
      }
    },
    {
      field: 'area',
      headerName: 'Área',
      sortable: false,
      flex: 0.2,
      valueGetter: (params:GridValueGetterParams) => {
        if(params.row["planTesis"] !== undefined){
          return `${params.row["planTesis"]["areaEspecialidad"]["nombre"]}`;
        }else{
          return `- `;
        }
        
      }
    },
    {
      field: 'asesor',
      headerName: 'Asesor',
      sortable: false,
      flex: 0.35,  
      valueGetter: (params:GridValueGetterParams) => {
        if(params.row["planTesis"] !== undefined){
          if(params.row["planTesis"]["profesores"]!== null){
            return `${params.row["planTesis"]["profesores"][0]["profesor"]["usuario"]["nombre"]} ${params.row["planTesis"]["profesores"][0]["profesor"]["usuario"]["apellido"]} <${params.row["planTesis"]["profesores"][0]["profesor"]["usuario"]["correo"]}>`;
          }else{
            return `No tiene asesor asignado `;
          }          
        }else{
          return `No tiene asesor asignado `;
        }
        
      }
    },
    {
      field: 'codigoA',
      headerName: 'Código Asesor',
      sortable: true,
      flex: 0.18,
      valueGetter: (params:GridValueGetterParams) => {
        if(params.row["planTesis"] !== undefined){
          if(params.row["planTesis"]["profesores"]!== null){
            return `${params.row["planTesis"]["profesores"][0]["profesor"]["usuario"]["codigoPUCP"]}`;
          }else{
            return `-`;
          }          
        }else{
          return `-`;
        }
      }
    },
  ];

  const [alumnos, setAlumnos] = React.useState([]);
  const { user } = useAuth();

  const idCurso = props.idCurso;
  const nombreCurso = props.nombreCurso;
  const idSemestre = props.idSemestre;
  const anho = props.anho;
  const periodo = props.periodo;


  const [contadores, setContadores]= React.useState([]);  
  const [labels, setLabels]= React.useState([]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Temas de tesis por área',
      },
      legend: {
        position:'left',

      },
    },
  };
  
  const data = {
    labels: labels,
    datasets: [
      { 
        label: 'Cant. de alumnos',
        data: contadores,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(126, 15, 199, 0.8)',
          'rgba(15, 199, 101, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(126, 15, 199, 1)',
          'rgba(15, 199, 101, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const GridToolbarExport = ({ csvOptions, ...other }) => (
    <GridToolbarExportContainer {...other}>
      <GridCsvExportMenuItem options={csvOptions} />
    </GridToolbarExportContainer>
  );
  

  React.useEffect(() => {
    showData();    
  }, []);

  const showData = async() => {
    const arrLabels = ["Sin tema de tesis"];
    const arrCont = [0];    
    const dataAsesores = ["Sin asesor"];
    const contAsesores = [0];
    const response= await axios.get(`/coordinador/curso/${idCurso}/listarAlumnoConAsesor`);
    setAlumnos(response.data);        
    const idEspecialidad = user["especialidad"]["idEspecialidad"];
    const arr = await axios.get(`/planTesis/areas/${idEspecialidad}`);
    for( let i=0 ; i<arr.data.length; i++){
      arrLabels.push(arr.data[i].nombre);
      arrCont.push(0);
    }  
    for(let j=0; j<response.data.length ; j++){   
        if(response.data[j]["planTesis"]!== undefined){
          for( let i=1 ; i<arrLabels.length; i++){
            if(response.data[j]["planTesis"]["areaEspecialidad"]["nombre"] === arrLabels[i]){
              arrCont[i] = arrCont[i] +1;
            }
          }
        }else{
          arrCont[0] = arrCont[0] +1;
        }
    }   
    setLabels(arrLabels);   
    setContadores(arrCont);
  };     

  return (
    <div name="reportedealumnos" className="h-screen-pucp flex overflow-x-hidden overflow-y-auto bg-white">
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <Grid container spacing={2}>
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
                                  fileName: props.claveCurso+" ["+ props.anho + "-" + props.periodo +"] - Reporte de alumnos, temas y asesores",
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

          <div className="h-10"></div>

          <div className="flex flex-row space-x-4">
          <div className="w-1/5"></div>
            <div className="w-3/5 border-2">
              <div className="mx-8">
                <Pie data={data} options={options} /> 
              </div>              
            </div>
          </div>
         
    </div>
  </div>
  );
};

export default ReporteDeAlumnos

