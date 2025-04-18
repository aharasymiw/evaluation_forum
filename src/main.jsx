import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
// import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './index.css'
import App from './App.jsx'
// import ErrorPage from './routes/ErrorPage/ErrorPage';

// import LandingPage from './routes/LandingPage/LandingPage.jsx';
// import Register from './routes/Register/Register.jsx';
// import Login from './routes/Login/Login.jsx';
// import Upload from './routes/Upload/Upload.jsx';
// import Results from './routes/Results/Results.jsx';
// import Profile from './routes/Profile/Profile.jsx';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "/",
//         element: <LandingPage />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },
//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "upload",
//         element: <Upload />,
//       },
//       {
//         path: "results",
//         element: <Results />,
//       },
//       {
//         path: "profile",
//         element: <Profile />,
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById('root')).render(
    // <RouterProvider router={router} />
    <StrictMode>
      <App />
    </StrictMode>
)
