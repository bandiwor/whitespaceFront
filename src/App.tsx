import {lazy, Suspense} from "solid-js";
import AppLoader from "./AppLoader.tsx";


const LazyApp = lazy(() => import("./LazyApp.tsx"));


export default function App() {
    return <Suspense fallback={<AppLoader/>}>
        <LazyApp/>
    </Suspense>;
}