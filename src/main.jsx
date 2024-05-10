import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./Error.jsx";
import Detail from "./Detail.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Quran from "./Quran.jsx";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Header />
          <App />
          <Footer />
        </>
      ),
    },
    {
      path: "/:id/:title/",
      element: (
        <>
          <Header />
          <Detail />
          <Footer />
        </>
      ),
    },
    {
      path: "/surah/:id",
      element: (
        <>
          <Header />
          <Quran />
          <Footer />
        </>
      ),
    },
    {
      path: "*",
      element: (
        <>
          <Header />
          <Error />
          <Footer />
        </>
      ),
    },
  ],
  { basename: "/vio-quran" }
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
