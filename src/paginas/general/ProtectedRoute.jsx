import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../../componentes/Context";
import NavHorizontalBar from "../../componentes/NavHorizontalBar";
import {Container} from "@mui/material";
import styled from "@emotion/styled";

const ProtectedRoute = () => {
    const {user} = useAuth();
    const location = useLocation();

    if (Object.keys(user).length === 0) {
        return <Navigate to="/"/>
    } else {
        if (user["listaRoles"].length > 0) {
            const flujo = location.pathname.split("/")[1].toUpperCase();
            if (Object.keys(user).length !== 0) {
                // buscar flujo en roles
                const found = user["listaRoles"].find((e) => ["SELECCIONDEROLES", e["nombre"]].includes(flujo));
                if (typeof found === "undefined") {
                    return <Navigate to="/seleccionderoles"/>
                }
            }
        }
    }

    return (
        <>
            <NavHorizontalBar />
            <DummyDiv/>
            <Container component={"main"}>
                <Outlet/>
            </Container>
        </>
    )
}

const DummyDiv = styled.div`
  height: 40px;
  background-color: rgb(28, 72, 143);
  align-items: center;
  margin-bottom: -40px;
`

export default ProtectedRoute;