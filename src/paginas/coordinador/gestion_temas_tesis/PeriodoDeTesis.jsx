// @flow
import * as React from "react";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useSnackbar } from 'notistack'

const PeriodoDeTesis = (): React.Node => {
  const [periodoState, setPeriodoState] = React.useState({
    periodos: [],
    periodo: {
      fechaInicio: null,
      fechaFin: null,
    },
  });

  // $FlowIgnore
  const columns: GridColDef[] = [
    {
      field: "fechaInicio",
      headerName: "Fecha de Inicio",
      sortable: false,
      flex: 1,
      valueGetter: (params) => {
        const dt = dayjs(params.value);
        return dt.format("DD/MM/YYYY");
      },
    },
    {
      field: "fechaFin",
      headerName: "Fecha Fin",
      sortable: false,
      flex: 1,
      valueGetter: (params) => {
        const dt = dayjs(params.value);
        return dt.format("DD/MM/YYYY");
      },
    },
    {
      field: "activo",
      headerName: "Activo",
      sortable: false,
      flex: 1,
      valueGetter: (params) => {
        if (params.value === true) return "SI";
        return "NO";
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            color={"error"}
            disabled={!params.row["activo"]}
            onClick={(e) => handleFinalizarPeriodo(e, params.row["id"])}
          >
            Finalizar
          </Button>
        );
      },
    },
  ];

  const isDisabled = React.useMemo(() => {
    return (
      periodoState.periodos.filter((e) => e["activo"] === true).length >= 1
    );
  }, [periodoState.periodos]);

  const getPeriodos = async () => {
    const response = await axios.get("/planTesis/getAllPeriodos");
    const fecha = { ...periodoState.periodo };
    fecha.fechaInicio = null;
    fecha.fechaFin = null;
    setPeriodoState({
      ...periodoState,
      periodos: response.data,
      periodo: fecha,
    });
  };

  // $FlowIgnore
  const handleDateChange = (newDate: Dayjs, name: string) => {
    const fecha = { ...periodoState.periodo };
    // $FlowIgnore
    fecha[name] = newDate;
    setPeriodoState({ ...periodoState, periodo: fecha });
  };
  const { enqueueSnackbar } = useSnackbar();
  const [errorPeriodoValue, setErrorPeriodoValue] = React.useState(false);
  const [errorPeriodoText, setErrorPeriodoText] = React.useState("");
  const handlePeriodoSave = async () => {
// $FlowIgnore
    const dif = periodoState.periodo.fechaInicio.diff(
      periodoState.periodo.fechaFin
    );
    if (dif < 0) {
      await axios.post(
        "/planTesis/iniciarPeriodoPropuestas",
        periodoState.periodo
      );
      setErrorPeriodoText("");
      setErrorPeriodoValue(false);
      enqueueSnackbar("Nuevo periodo realizado", {variant: "success"});
    } else {
      setErrorPeriodoText("Fecha no permitida");
      setErrorPeriodoValue(true);
      enqueueSnackbar("Error al subir el periodo", {variant: "error"});
    }
    await getPeriodos();
  };

  const handleFinalizarPeriodo = async (
    event: SyntheticInputEvent<>,
    id: number
  ) => {
    await axios.post(`/planTesis/finalizarPeriodo/${id}`);
    enqueueSnackbar("Ha finalizado el periodo", {variant: "info"});
    await getPeriodos();
  };

  React.useEffect(() => {
    getPeriodos().catch();
  }, []);

  React.useEffect(() => {
    const fecha = { ...periodoState.periodo };
    fecha.fechaFin = fecha.fechaInicio;
    setPeriodoState({ ...periodoState, periodo: fecha });
  }, [periodoState.periodo.fechaInicio]);

  return (
    <>
    <div className="pb-6 mt-6 grid grid-cols-1">
      <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
        Periodo de Propuesta de Tesis
      </p>
    </div>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <DatePicker
            openTo="month"
            views={["year", "month", "day"]}
            label="Fecha Inicio"
            inputFormat={"DD/MM/YYYY"}
            disabled={isDisabled}
            onChange={(newValue) => handleDateChange(newValue, "fechaInicio")}
            value={periodoState.periodo.fechaInicio}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size={"small"}
                error={errorPeriodoValue}
                helperText={errorPeriodoText}
              />
            )}
          />
        </Grid>
        <Grid xs={4}>
          <DatePicker
            openTo="month"
            views={["year", "month", "day"]}
            label="Fecha Fin"
            disabled={isDisabled}
            inputFormat={"DD/MM/YYYY"}
            onChange={(newValue) => handleDateChange(newValue, "fechaFin")}
            value={periodoState.periodo.fechaFin}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size={"small"}
                error={errorPeriodoValue}
                helperText={errorPeriodoText}
              />
            )}
          />
        </Grid>
        <Grid xs={4} display="flex" justifyContent="left" alignItems="center">
          <Button
            startIcon={<AddIcon />}
            onClick={handlePeriodoSave}
            disabled={isDisabled}
          >
            Iniciar periodo
          </Button>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h6">Periodos anteriores</Typography>
        </Grid>
        <Grid xs={12}>
          <Box sx={{ height: 500, width: '100%' , marginBottom:6 }}>
            <DataGrid
              rows={periodoState.periodos}
              columns={columns}
              disableSelectionOnClick={true}
              experimentalFeatures={{ newEditingApi: true }}
              autoPageSize
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PeriodoDeTesis;
