import {Navigate, Route, Router} from "@solidjs/router";
import {lazy, Suspense} from "solid-js";
import MainLayout from "../components/layouts/MainLayout/MainLayout.tsx";
import SidebarLayout from "../components/layouts/SidebarLayout/SidebarLayout.tsx";
import ChatIdPage from "../pages/chats/[id]/Chat[id]Page.tsx";
import ChatsPage from "../pages/chats/ChatsPage.tsx";
import ChatOpenPage from "../pages/chats/open/ChatOpenPage.tsx";
import FriendsPage from "../pages/friends/FriendsPage.tsx";
import HelpPage from "../pages/help/HelpPage.tsx";
import NewsPage from "../pages/news/NewsPage.tsx";
import ProfilePage from "../pages/profile/ProfilePage.tsx";
import SettingsPage from "../pages/settings/SettingsPage.tsx";
// import AuthRoutes from "./AuthRoutes.tsx";

const AuthRoutes = lazy(() => import('./AuthRoutes'));

export default function AllRoutes() {
    return <Router explicitLinks>
        <Route path={"/"} component={MainLayout}>
            <Route path={"/"} component={SidebarLayout}>
                <Route path={""} component={() => <Navigate href={"/chats"}/>}/>
                <Route path={"/news"} component={NewsPage}/>
                <Route path={"/chats"}>
                    <Route path={"/"} component={ChatsPage}/>
                    <Route path={"/:id"} component={ChatIdPage}/>
                </Route>
                <Route path={"/chat/open"} component={ChatOpenPage}/>
                <Route path={"/profile"} component={ProfilePage}/>
                <Route path={"/friends"} component={FriendsPage}/>
                <Route path={"/settings"} component={SettingsPage}/>
                <Route path={"/help"} component={HelpPage}/>
            </Route>
        </Route>
        <Suspense>
            <AuthRoutes/>
        </Suspense>
    </Router>;
}