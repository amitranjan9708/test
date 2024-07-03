
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import logo from "../image/logo3.png";
import "./mystyles.css";
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!userData || !userData.name) {
      console.log("User not authenticated");
      navigate("/");
    }
  }, [userData, navigate]);

  if (!userData || !userData.name) {
    return null; // Return null to prevent rendering the component if not authenticated
  }

  return (
    <div className={`welcome-container${lightTheme ? "" : " dark"}`}>
      <img src={logo} alt="Logo" className='welcome-logo' />
      <b>Hi, {userData.name}</b>
      <p>View and text directly to people present in the chat rooms</p>
    </div>
  );
}

export default Welcome;
