import React from "react";
import { RouterProvider } from "react-router-dom";
import { myRoutes } from "./router/router";

const App = () => {
  return (
    <div>
      <RouterProvider router={myRoutes}></RouterProvider>
    </div>
  );
};

export default App;
