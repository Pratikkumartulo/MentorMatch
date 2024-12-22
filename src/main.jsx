import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store.js';
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Pages/Home.jsx';
import Login from './Components/Login.jsx';
import SignUp from './Pages/Signup.jsx';
import User from './Components/User.jsx';
import AuthLayout from './Components/AuthLayout.jsx';
import UserEdit from './Components/UserEdit.jsx';
import Application from './Components/Application.jsx';
import AdminPage from './Components/Admin.jsx';
import AdminLogin from './Components/AdminLogin.jsx';
import Adminapplication from './Components/AdminApplication.jsx';
import ViewUser from './Pages/viewUser.jsx';
import ViewMentor from './Pages/ViewMentors.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import ChatPage from './Components/ChatPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/404",
        element:<ErrorPage/>
      },
      {
        path:"/login",
        element:<Login/>
      },
      {
        path:"/signup",
        element:<SignUp/>
      },{
        path:"/user/:slug",
        element:(
          <AuthLayout authentication={false}>
              <User/>
          </AuthLayout>
      )},
      {
        path:"/u/:slug",
        element:(
          <AuthLayout authentication={false}>
            <ViewUser/>
          </AuthLayout>
        )
      },
      {
        path:"/mentor/:slug",
        element:(
          <AuthLayout authentication={false}>
            <ViewMentor/>
          </AuthLayout>
        )
      },
      {
        path:'user/:slug/edit',
        element:(
          <AuthLayout authentication={false}>
            <UserEdit/>
          </AuthLayout>
        )
      },{
        path:'user/:slug/application',
        element:(
            <AuthLayout authentication={false}>
              <Application/>
            </AuthLayout>
            )
      },{
        path:"/admin",
        element:(
        <AuthLayout authentication={false}>
          <AdminPage/>
        </AuthLayout>)
      },
      {
        path:"/admin/login",
        element:<AdminLogin/>
      },
      {
        path:"/admin/applications",
        element:(
          <AuthLayout authentication={false}>
            <Adminapplication/>
          </AuthLayout>
        )
      }
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
