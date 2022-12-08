import React from "react";
import {Navigate} from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../componentes/Context"
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Usuario} from "./DovahTypes";

const Inicio = (): JSX.Element => {
  const [values, setValues] = React.useState({
    correo: "",
    password: ""
  });
  const {user, setUser} = useAuth();
  const [jwt, setJwt] = React.useState(() => {
    let value = localStorage.getItem("jwt");
    if (value == null) value = "";
    return value;
  });
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [event.target.name]: event.target.value});
  }

  const handleUserPasswordLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (values.correo === "" || values.password === "") return;
    const response = await axios.post("/usuario/auth", values);
    const token = response.data["jwt-token"];
    if (token === "") {
      setErrorMsg("Credenciales incorrectas");
    } else {
      setJwt(token);
      const res2 = await getUserInfo(token);
      await validateUser(res2);
    }
  }

  const validateUser = async (usuario: Usuario | null) => {
    let hasError = false;
    if (usuario == null) {
      hasError = true;
    } else if (usuario["correo"] === "anonymousUser") {
      hasError = true;
    } else if (usuario["nombre"] === "not-found") {
      hasError = true;
      setErrorMsg("Usuario no esta autorizado");
      await axios.post("/logout");
    } else if (usuario["listaRoles"].length === 0) {
      hasError = true;
      setErrorMsg("Usuario no esta autorizado");
      await axios.post("/logout");
    }
    if (hasError) {
      setLoading(false);
      axios.defaults.headers.common['Authorization'] = "";
      setJwt("");
    } else {
      if (usuario != null) {
        usuario["rolActual"] = usuario["listaRoles"][0]["nombre"].toLowerCase();
        setUser(usuario);
      }
    }
  }

  const handleGoogleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.replace("/oauth2/authorization/google");
  }

  const getUserInfo = async (token: string) => {
    let config = {};
    if (token != null && token !== "") config = {headers: {Authorization: `Bearer ${token}`}}
    let response;
    try {
      response = await axios.get("/usuario/auth/info", config);
    } catch (e) {
      return null;
    }
    let tmp = response.data;
    if (tmp["picture"] == null || tmp["picture"] === "") {
      response.data["picture"] = `https://ui-avatars.com/api/?name=${tmp["nombre"]}+${tmp["apellido"]}`;
    }
    return response.data;
  }

  React.useEffect(() => {
    getUserInfo(jwt)
        .then(response => validateUser(response));
  }, []);

  React.useEffect(() => {
    localStorage.setItem("jwt", jwt);
    if (jwt != null && jwt !== "") {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    }
  }, [jwt]);

  if (Object.keys(user).length !== 0) return <Navigate to="/seleccionderoles"/>;

  if (loading) return <></>;

  return (
    <div className="h-screen w-full bg-white">
      <div className="bg-blue-pucp absolute top-0 left-0 bg-gradient-to-b from-blue-pucp via-blue-pucp to-white bottom-0 leading-5 h-full w-full overflow-hidden"></div>

      <div className="relative   min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex  self-center lg:px-14 sm:max-w-4xl xl:max-w-md  z-10">
          <div className="self-start hidden lg:flex flex-col  text-gray-300">
            <h1 className="my-3 font-semibold text-4xl">
              Bienvenido al Sistema de Gestión de Tesis PUCP
            </h1>
            <p className="pr-3 text-sm opacity-75">
              Inicie sesión para poder utilizar todas las funcionalidades
              disponibles
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center  z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96 ">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">
                Iniciar Sesión
              </h3>
              <Typography color="red" variant="caption">
                {errorMsg}
              </Typography>
            </div>
            <div className="space-y-6">
              <Box component="form">
                <input
                  className=" w-full text-sm  px-4 py-3 mb-4 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="email"
                  placeholder="Correo Electrónico"
                  name="correo"
                  autoComplete="username"
                  onChange={handleChange}
                />

                <input
                  className=" w-full text-sm  px-4 py-3 mb-4 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="password"
                  placeholder="Contraseña"
                  name="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full flex justify-center bg-blue-800  hover:bg-blue-pucp text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500"
                    onClick={handleUserPasswordLogin}
                >
                  Sign in
                </button>

                <div className="flex items-center justify-center space-x-2 my-5">
                  <span className="h-px w-16 bg-gray-100"></span>
                  <span className="text-gray-300 font-normal">or</span>
                  <span className="h-px w-16 bg-gray-100"></span>
                </div>
                <div className="flex justify-center gap-5 w-full ">
                    <button
                        type="button"
                        className="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:bg-blue-gray-100 text-sm text-gray-500 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500"
                        onClick={handleGoogleLogin}
                    >
                      <svg
                          className="w-4 mr-2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                        />
                        <path
                            fill="#34A853"
                            d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                        />
                        <path
                            fill="#4A90E2"
                            d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                        />
                      </svg>
                      <span>Google</span>
                    </button>
                </div>
              </Box>
              <div className="mt-7 text-center text-blue-300 text-xs">
                <span>Copyright C+o- © 2022-2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-transparent absolute w-full bottom-0 left-0 z-30">
        <div className="container p-5 mx-auto  flex items-center justify-between ">
          <div className="flex mr-auto"></div>
        </div>
      </footer>

      <svg
        className="absolute bottom-0 left-0 "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Inicio;
