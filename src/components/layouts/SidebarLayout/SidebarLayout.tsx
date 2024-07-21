import {RouteSectionProps} from "@solidjs/router";
import {Component, JSX, lazy, Suspense} from "solid-js";
import cls from "./SidebarLayout.module.scss";


const Sidebar = lazy(() => import("./Sidebar"));


const SidebarLayout: Component<RouteSectionProps<{ children: JSX.Element }>> = (props) => {
    return <div class={cls.layout}>
        <Suspense>
            <Sidebar/>
        </Suspense>
        <section class={cls.content}>
            {props.children}
        </section>
    </div>;
};

export default SidebarLayout;
