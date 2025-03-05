import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import SignIn from "../components/SignIn";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
import DocsPage from "../pages/DocsPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <PrivateRoute><HomePage/></PrivateRoute>
        },
        {
            path: "/profile",
            element: <PrivateRoute><ProfilePage/></PrivateRoute>
        },
        {
            path: "/docs/:id",
            element: <PrivateRoute><DocsPage/></PrivateRoute>
        },
        {
            path: "/login",
            element: <SignIn/>
        },
      ]
    },
]);

export default router;