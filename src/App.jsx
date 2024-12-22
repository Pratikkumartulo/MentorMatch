import { useEffect, useState } from 'react'
import conf from './config/EnvConfig'
import './App.css'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import LogoutButton from './Components/LogoutBtn'
import toast,{Toaster} from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Home from "./Pages/Home";
import { Outlet } from 'react-router-dom'
import authServie from './Appwrite/UserConfig'
import { login,logout } from './store/AuthSlice'
import { useDispatch } from 'react-redux'



function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.Toast.success);
  const msg = useSelector((state) => state.Toast.msg);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    authServie.getCurrentUser()
    .then((user=>{
      dispatch(login(user));
    }))
    .catch(()=>{
      dispatch(logout());
    })
    if (initialized) {
      if (status) {
        toast.success(msg);
      } else {
        toast.error(msg);
      }
    } else {
      // Mark as initialized after the first render
      setInitialized(true);
    }
  }, [status, msg]); // Trigger when status or msg changes

  return (
    <>
      <div className="h-screen w-full">
        <Toaster />
        <Outlet/>
      </div>
    </>
  );
}

export default App
