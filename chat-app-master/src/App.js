import logo from './logo.svg';
import './App.css';
import { Routes , Route } from 'react-router-dom';
import Login from './components/Login';
import MainContainer from './components/MainContainer';
import Welcome from './components/Welcome';
import ChatArea from './components/ChatArea';
import Users_Groups from './components/Users_Groups';
import CreateGroups from './components/CreateGroups';

function App() {
  const chatData = {
    name: 'Test#1',
    timestamp: 'today',
  };
  return (
    <div className="App">
    <h1>
     <Routes>
          <Route path="/" element={<Login />} />
           <Route path="app" element={<MainContainer /> } >
             <Route path="welcome" element={<Welcome />} />
             <Route path="chat/:_id" element={<ChatArea />} />
             <Route path="users" element={<Users_Groups />} />
             <Route path="creategroups" element={<CreateGroups />} />
           

         </Route>
        </Routes>
    </h1>
    </div>
  );
}

export default App;
