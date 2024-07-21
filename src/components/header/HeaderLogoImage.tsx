import cls from "./HeaderLogoImage.module.scss";


export default function HeaderLogoImage({className, imageClassName}: { className?: string, imageClassName?: string }) {
    return <figure class={`${className || ""} ${cls.wrapper}`.trim()}>
        <img width={32} height={32} class={`${imageClassName || ""} ${cls.image}`} src="/icons/whitespace-logo.png"
             alt=""/>
    </figure>;
}