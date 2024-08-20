import AddStudent from "./component/AddStudent";
import ListStudent from "./component/ListStudent";
import EditStudent from "./component/EditStudent";
import StudentView from "./component/StudentView";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css"
import Header from "./component/common/Header";
import Login from "./component/Login";
import PrivateRoute from "./component/PrivateRoute";
import Chat from "./socket/Chat";

function Layout()
{
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<PrivateRoute element={<ListStudent />} />} />
        <Route path='add' element={<PrivateRoute element={<AddStudent />} />} />
        <Route path='view/:id' element={<PrivateRoute element={<StudentView />} />} />
        <Route path='/edit/:id' element={<PrivateRoute element={<EditStudent />} />} />
        <Route path='/chat' element={<PrivateRoute element={<Chat />} />} />
        <Route path='*' element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}


function App()
{
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;