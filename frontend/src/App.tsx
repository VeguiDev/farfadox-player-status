import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StatusPage from "./pages/StatusPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StatusPage></StatusPage>,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
