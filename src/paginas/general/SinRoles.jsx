// @flow
import * as React from "react";
import BienvenidaUsuario from "./BienvenidaUsuario";

const SinRoles = (): React.Node => {
    return (
        <div style={{marginTop: 40}}>
            <p>Usuario no tiene roles asignados</p>
            <BienvenidaUsuario/>
        </div>
    )
};

export default SinRoles;