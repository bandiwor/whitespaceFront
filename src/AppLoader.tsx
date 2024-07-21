import cls from "./App.module.scss";
import HeaderLogoImage from "./components/header/HeaderLogoImage.tsx";

export default function AppLoader({enableAnimations}: { enableAnimations?: boolean }) {
    return <main class={cls.loader}>
        <div class={cls.content} classList={{[cls.pulse]: enableAnimations}}>
            <HeaderLogoImage imageClassName={cls.logo_image}
                             className={`${enableAnimations ? cls.bounce : ""} ${cls.logo}`.trim()}/>
            <span class={cls.label}>White Space</span>
        </div>
    </main>;
}