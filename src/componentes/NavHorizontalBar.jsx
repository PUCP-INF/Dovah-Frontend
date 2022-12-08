import React from "react";
import styled from "@emotion/styled";
import {useAuth} from "./Context"
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';


const NavHorizontalBar = () => {

  const {user, setUser} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
      await axios.post("/logout");
      setUser({});
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
      navigate("/");
  };

  var userInfo_buttom = <></>;
  if (Object.keys(user).length !== 0) {
      userInfo_buttom =
        <UserSection>
          <div className="cursor-pointer">
            <LogoutIcon sx={{ color: "white"}} fontSize="large" onClick={handleLogout}/>
          </div> 
          <UserImg>
            <img  src= {user["picture"]} />
            <p>{user["nombre"] + " " + user["apellido"]}  </p>
          </UserImg>
        </UserSection>

  }

  return (
    <Nav>
      <Logo src = "https://pandora.pucp.edu.pe/pucp/c3/images/logo_pucp2021.svg" ></Logo>
      {userInfo_buttom}
    </Nav>

  );
};

export default NavHorizontalBar;

const Nav = styled.div`
  height: 80px;
  background-color: rgb(4 35 84);
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 36px;
  overflow-x: hidden;
  overflow-y: hidden;
`
const Logo = styled.img`
  max-width: 80%;
  margin-right: auto;
`

const UserImg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  p {
    text-align: center;
    font-size: small;
    font-weight: bolder;
    color: rgb(255 255 255);
  }
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`