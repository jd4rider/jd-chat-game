import * as elements from "typed-html";
import WordHolder from "../partials/WordHolder";

const NotificationsConnector = ({children}: elements.Children) => {
    return (
        <div class="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
            <div hx-ext="ws" ws-connect="/ws">
                {children}
            </div>
        </div>
    )
}

export default NotificationsConnector;