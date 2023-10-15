import * as elements from "typed-html";

const WordHolder = ({children}: elements.Children) => {
  return (
    <div class="text-slate-500 dark:text-slate-400 mt-2 text-9xl text-center tracking-widest" id="wordholder">
      {children}
    </div>
  );
}

export default WordHolder;