import axios from "axios";

let baseURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = "http://localhost:8081/api/v1"
} else {
    baseURL = "https://inf245g4i1.inf.pucp.edu.pe/api/v1"
}

axios.defaults.baseURL = baseURL;

export default axios;
