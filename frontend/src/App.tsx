import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StatusPage from "./pages/StatusPage";
import { SuccessLoginPage, LoginFailPage } from "./pages/SuccessLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StatusPage></StatusPage>,
  },
  {
    path: "/success/login",
    element: <SuccessLoginPage></SuccessLoginPage>,
  },
  {
    path: "/failed/login",
    element: <LoginFailPage></LoginFailPage>,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
