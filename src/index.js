import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./routes/App";
import './App.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MainQuizz from "./game/MainQuizz";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "game/:roomId",
        element: <MainQuizz />,
    },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);