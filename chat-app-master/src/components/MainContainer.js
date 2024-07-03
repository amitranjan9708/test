import React from 'react'
import "./mystyles.css";
import Side_bar from './Side_bar';
import ChatArea from './ChatArea';
import Welcome from './Welcome';
import Login from './Login';
import CreateGroups from './CreateGroups';
import Users_Groups from './Users_Groups';
import { Outlet } from 'react-router-dom';
import { createContext ,useState,} from 'react';
import { useDispatch,useSelector } from 'react-redux';

export const myContext = createContext();

function MainContainer() {

  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const lightTheme = useSelector((state) => state.themeKey);
    const chatData = {
        name: 'Test#1',
        timestamp: 'today',
      };
  return (
    <div className={"main-container" + (lightTheme ? "" : " dark")}>
       
       <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
       <Side_bar />
       <Outlet/>
      {/* <Welcome /> */}
      {/* <CreateGroups /> */}
      {/* <ChatArea props={conversations[0]} /> */}
      {/* <Users /> */}
      {/* <Groups /> */}
       </myContext.Provider>
        
    </div>

  )
}


export default MainContainer
