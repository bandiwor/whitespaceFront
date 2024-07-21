import {RouteSectionProps} from "@solidjs/router";
import {Component, JSX, lazy, Suspense} from "solid-js";
import cls from "./MainLayout.module.scss";

const Header = lazy(() => import("../../header/Header"));

const MainLayout: Component<RouteSectionProps<{ children: JSX.Element }>> = ({children}) => {
    return <div class={cls.layout}>
        <div class={cls.header_wrapper}>
            <Suspense fallback={""}>
                <Header/>
            </Suspense>
        </div>
        <div class={cls.content}>
            {children}
        </div>
    </div>;
};

export default MainLayout;
