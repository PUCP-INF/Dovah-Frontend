import {Routes, Route} from "react-router-dom";
import InicioSesion from "./paginas/general/InicioSesion";
import SeleccionRoles from "./paginas/general/SeleccionRoles";
import ProtectedRoute from "./paginas/general/ProtectedRoute";
import FlujoAdministrador from "./paginas/administrador/FlujoAdministrador";
import FlujoCoordinador from "./paginas/coordinador/FlujoCoordinador";
import FlujoProfesor from "./paginas/profesor/FlujoProfesor";
import FlujoAlumno from "./paginas/alumno/FlujoAlumno";
import FlujoAsesor from "./paginas/asesor/FlujoAsesor";
import FlujoJurado from "./paginas/jurado/FlujoJurado";
import CssBaseline from "@mui/material/CssBaseline";
import SinRoles from "./paginas/general/SinRoles";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {esES as gridEsES} from "@mui/x-data-grid";
import {esES as coreEsES} from "@mui/material/locale";
import {esES as dateEsES} from "@mui/x-date-pickers";

const theme = createTheme({
    palette: {
        mode: 'light',
    },
},
    gridEsES,
    coreEsES,
    dateEsES
);

const App = () => {
  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
              <Route path="/" element={<InicioSesion />} />

              <Route path="/*" element={<ProtectedRoute/>} >
                  <Route path="seleccionderoles" element={<SeleccionRoles />}/>
                  <Route path="sinrol" element={<SinRoles/>}/>
                  <Route path="admin/*" element={<FlujoAdministrador/>}/>
                  <Route path="coordinador/*" element={<FlujoCoordinador/>}/>
                  <Route path="profesor/*" element={<FlujoProfesor/>}/>
                  <Route path="alumno/*" element={<FlujoAlumno/>}/>
                  <Route path="asesor/*" element={<FlujoAsesor/>}/>
                  <Route path="jurado/*" element={<FlujoJurado/>}/>
                  <Route path="*" element={<h1>ERROR</h1>}/>
              </Route>
          </Routes>
      </ThemeProvider>
  );
}

export default App;