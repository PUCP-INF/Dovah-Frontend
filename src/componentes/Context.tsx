import * as React from "react";
import {createContext, useContext, useState} from "react";
import {Usuario} from "../paginas/general/DovahTypes";

type UsuarioContext = {
    user: Usuario,
    setUser: Function
}

const UserContext = createContext<UsuarioContext>({} as UsuarioContext);
const NavbarContext = createContext({});

const ContextProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<Usuario>({} as Usuario)
    const [navbar, setNavbar] = useState({});

    return (
        <UserContext.Provider value={{user, setUser}}>
            <NavbarContext.Provider value={{navbar, setNavbar}}>
                {children}
            </NavbarContext.Provider>
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(UserContext);
};
export const useNavbar = () => {
    return useContext(NavbarContext);
}
export default ContextProvider;