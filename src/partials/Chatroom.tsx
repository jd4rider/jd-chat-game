import * as elements from "typed-html";

export default function ChatRoom({children}: elements.Children) {
    return(
        <div class="text-slate-500 dark:text-slate-400 mt-2 text-4xl text-center" id="chat_room">
            {children}
        </div>
    )
}