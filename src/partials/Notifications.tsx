import * as elements from "typed-html"

const Notifications = ({children}: elements.Children) => {
    return (
        <div class="text-slate-500 dark:text-slate-400 mt-2 text-6xl text-center" id="notifications">
            {children}
        </div>
    )
}

export default Notifications;