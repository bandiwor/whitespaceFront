import {Route} from "@solidjs/router";
import AuthLayout from "../components/layouts/AuthLayout/AuthLayout.tsx";
import CreateProfilePage from "../pages/auth/CreateProfilePage.tsx";
import LoginPage from "../pages/auth/LoginPage.tsx";
import RegisterPage from "../pages/auth/RegisterPage.tsx";

export default function AuthRoutes() {
    return <Route path="/auth" component={AuthLayout}>
        <Route path="/login" component={LoginPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/create-profile" component={CreateProfilePage}/>
    </Route>
}