import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import SignIn from "../components/SignIn";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";

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
            path: "/login",
            element: <SignIn/>
        },
      ]
    },
]);

export default router;