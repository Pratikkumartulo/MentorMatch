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
import ViewUser from './Pages/ViewUser.jsx';
import ViewMentor from './Pages/ViewMentors.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import ChatPage from './Components/ChatPage.jsx';
import ChatPanel from './Components/ChatPanel.jsx';
import Followers from './Pages/Followers.jsx';
import Followings from './Pages/Followings.jsx';
import Community from './Pages/Community.jsx';

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
        path:"/chat",
        element:(
          <AuthLayout authentication={false}>
            <ChatPage/>
          </AuthLayout>),

          children:[
            {
              path:":slug",
              element:<ChatPanel/>
            }
          ]
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
      },
      {
        path:"/community",
        element:(
          <AuthLayout authentication={false}>
            <Community/>
          </AuthLayout>)
      }
      ,
      {
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
        path:"/u/:slug/followers",
        element:(
          <AuthLayout authentication={false}>
            <Followers/>
          </AuthLayout>
        )
      },
      {
        path:"/u/:slug/followings",
        element:(
          <AuthLayout authentication={false}>
            <Followings/>
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
      },
      {
        path:"*",
        element:<ErrorPage/>
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