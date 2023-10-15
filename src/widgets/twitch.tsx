import Notifications from "../partials/Notifications";
import WordHolder from "../partials/WordHolder";
import ChatRoom from "../partials/Chatroom";
import * as elements from "typed-html";

type WordObj = {
    word: string;
    guessed: string;
    solved: boolean;
    length: number;
  }

let wordObject: WordObj = {'word': '', 'guessed': '', 'solved': true, 'length': 0};

export async function onMessageHandlerWS (target: any, context: any, msg: any, self: any, ws: any) {
    // Remove whitespace from chat message
    const commandName = msg.trim();
 
    if (commandName.includes('!word')) {
     if(wordObject.solved) {
         const wordLength = parseInt(commandName.substring(6)) || 5
         wordObject = await getWord(wordLength)
         ws.send(<Notifications>The random word is {wordObject.length} letters long.</Notifications>)
         ws.send(<WordHolder> {wordObject.guessed} </WordHolder>)
         ws.send(<ChatRoom>Type !solve plus a letter to guess the next letter of the word. Ex: !solve a</ChatRoom>)
     } else { 
       ws.send(<ChatRoom>The current word is not solved. The random word is {wordObject.length} letters long. {wordObject.guessed}</ChatRoom>)
       setTimeout(() =>
            ws.send(<ChatRoom>Type !solve plus a letter to guess the next letter of the word. Ex: !solve a</ChatRoom>)
       , 1000)
     }
   } else if (commandName.includes('!solve')) {
     const guess = commandName.substring(7, 8)
     if(wordObject.word.includes(guess)) {
         let letteroccurrences = getAllIndexes(wordObject.word, guess)
         for(let i in letteroccurrences) wordObject.guessed = setCharAt(wordObject.guessed, letteroccurrences[i], guess);
         ws.send(<WordHolder>{wordObject.guessed}</WordHolder>)
 
         if(!wordObject.guessed.includes('_')) {
            wordObject.solved = true;
            let winner = context.username
            setTimeout(() => {
                ws.send(<Notifications>Congratulations {winner} for finding the final letter!!!</Notifications>)
                ws.send(<ChatRoom>Type !word or !word # to guess the next letter of the word. Ex: !word or !word 4</ChatRoom>)
            } , 1000)
         }
     } else {
         ws.send(<ChatRoom>The random word does not contain an occurrence of the letter {guess}.</ChatRoom>)
     }
   }
 
 }
 
 // Called every time a message comes in
export async function onMessageHandler (target: any, context: any, msg: any, self: any, client: any) {
   if (self) { return; } // Ignore messages from the bot
 
   // Remove whitespace from chat message
   const commandName = msg.trim();
 
   // If the command is known, let's execute it
   if (commandName.includes('!dice')) {
     const {amount, sides} = rollDice(commandName.substring(6) || 6 );
     client.say(target, `You rolled a ${amount} from a ${sides} sided die`);
     //ws.send(`<div id="chat_room" hx-swap-oob="beforeend"><br>🍕jd4codes_chat_game🌮 You rolled a ${amount} from a ${sides} sided die</div>`)
 
     console.log(`* Executed ${commandName} command`);
   } else if (commandName.includes('!joshua')){
     client.say(target, 'Welcome to the matrix!!! Please enter your password')
   } else {
     //client.say(target, `@${context.username} Welcome to the chat`)
     console.log(`🍕${context.username}🌮 ${commandName}`);
   }
 }
 
 // Function called when the "dice" command is issued
 function rollDice (sides: number) {
   if(isNaN(sides)) {
     sides = 6
   }
   return {'amount': Math.floor(Math.random() * sides) + 1, 'sides': sides};
 }
 
 // Called every time the bot connects to Twitch chat
export function onConnectedHandler (addr: string, port: number) {
   console.log(`* Connected to ${addr}:${port}`);
}
 
 async function getWord (length: number) {
     if(length < 2) {length = 2} else if (length > 9) {length = 9}
     const res = fetch(`https://random-word-api.vercel.app/api?words=1&length=${length}`)
     const response = await res;
     const data: any = await response.json()
     return {'word': data[0], 'length': data[0].length, 'solved': false, 'guessed': '_'.repeat(data[0].length)}
 }
 
 function getAllIndexes(arr: string, val: string) {
     var indexes = [], i = -1;
     while ((i = arr.indexOf(val, i+1)) != -1){
         indexes.push(i);
     }
     return indexes;
 }
 
 function setCharAt(str: string, index: number, chr: string) {
     if(index > str.length-1) return str;
     return str.substring(0,index) + chr + str.substring(index+1);
 }