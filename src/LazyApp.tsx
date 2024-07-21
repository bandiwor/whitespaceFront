import {lazy, Suspense} from "solid-js";
import AppLoader from "./AppLoader.tsx";
import {AccountProvider} from "./contexts/AccountContext/AccountContext.tsx";
import {ChatsListProvider} from "./contexts/ChatsListContext/ChatsListContext.tsx";
import {TempAuthProvider} from "./contexts/TempAuthContext/TempAuthContext.tsx";
import {ThemeProvider} from "./contexts/ThemeContext/ThemeContext.tsx";
import {WebSocketProvider} from "./contexts/WebSocketContext/WebSocketContext.tsx";

const AllRoutes = lazy(() => import("./routes/AllRoutes.tsx"));


export default function LazyApp() {
    return (
        <AccountProvider>
            <WebSocketProvider>
                <ThemeProvider>
                    <TempAuthProvider>
                        <ChatsListProvider>
                            <Suspense fallback={<AppLoader enableAnimations/>}>
                                <AllRoutes/>
                            </Suspense>
                        </ChatsListProvider>
                    </TempAuthProvider>
                </ThemeProvider>
            </WebSocketProvider>
        </AccountProvider>
    );
}