import cls from "./ChatsPage.module.scss";


export default function NoChatsBanner() {
    return <div class={cls.no_chats_banner}>
        <h2 class={cls.title}>Чатов нету <span class={'font-bold'}>{'=('}</span></h2>
        <p class={cls.description}>
            Но их всегда можно <span class={cls.phrase_highlight}>найти</span>!
            Для этого ищи людей или группы <span class={cls.phrase_highlight}>в поиске</span> и начинай общение!
        </p>
    </div>
}