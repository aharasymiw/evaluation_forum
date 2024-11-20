import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import ErrorPage from './routes/ErrorPage/ErrorPage.tsx';

import LandingPage from './routes/LandingPage/LandingPage';
import Register from './routes/Register/Register';
import Login from './routes/Login/Login';
import Upload from './routes/Upload/Upload.tsx';
import Results from './routes/Results/Results';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "results",
        element: <Results />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
