import cls from "./HeaderAccount.module.scss";

export default function HeaderAccountSummaryLoading() {
    return <div aria-disabled={true} class={cls.summary_loading}>
        <div class={cls.summary_loading__label}>
            <div class={cls.placeholder}></div>
        </div>
        <div class={cls.summary_loading__image}></div>
    </div>
}