let messageForm = document.getElementById('sendMessage');
let Chat = document.getElementById('messages');
let token =localStorage.getItem('token');
let Users = document.getElementById('users')
let Messages = document.getElementById('messages');
let messagesContainer = document.querySelector('.messages-container');
messageForm.addEventListener('submit',addMessage);
let lastMessageId;


document.addEventListener('DOMContentLoaded',initialize );

async function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
async function initialize() {
    await Joined()
    
   
}
async function addMessage(e){
    e.preventDefault();
    let message = document.getElementById('messageInput').value;
    console.log(message);
    let obj ={
        message:message
    } 
    try{
        let response = await axios.post('http://localhost:3000/chat/messages',obj,{
            headers : {Authorization :token}
        })
        document.getElementById('messageInput').value ='';
         await addToLocalStorage ();
     }
    catch (err){
        console.log(err)

    }
}


async function Joined(){
   try{
        let Response = await axios.get('http://localhost:3000/chat/users');
        //console.log(Response.data.users[0].name)
        Users.innerHTML='';
        for(let i=0;i<Response.data.users.length;i++)
        {
        let li = document.createElement('li');
        li.innerHTML=`<p> ${Response.data.users[i].name} joined </p>`
        li.classList.add('joined')
        Users.appendChild(li);
       }
       await addToLocalStorage ();
       setTimeout(async()=>{await Joined() }, 5000);
    }
    catch(err){
        console.log(err);
    }
} 
async function addToLocalStorage ()
{
    if( localStorage.getItem('id')!== null)
   {
  lastMessageId = localStorage.getItem('id');
   }
    if(lastMessageId === undefined)
    {
        lastMessageId = 0;
    }
    try{
    let Response = await axios.get(`http://localhost:3000/chat/messages?Lstid=${lastMessageId}`);
    //console.log(Response)
      if(Response.data.response.length > 0)
      {
        let newMsg =[];
        let length = Response.data.response.length;
        //console.log("Array >>>>>>>",Response.data.response[0])
        for(let i=0;i<length;i++)
        {
            let data = Response.data.response[i];
            console.log(`${data.user.name} : ${data.message}`)
            newMsg.push(`${data.user.name} : ${data.message}`);
        }
        localStorage.setItem('id',Response.data.response[length-1].id)
        //console.log("last id >>>>>>>>>>",lastMessageId)
        let oldMsg =[];
        if( localStorage.getItem('data')!== null)
        {
         oldMsg =JSON.parse( localStorage.getItem('data'));
        }
        let Merge =[]
        Merge = oldMsg.concat(newMsg);
        if(Merge.length >= 1000)
        {
            Merge.splice(0,Merge.length-1000)
        }
        localStorage.setItem('data',JSON.stringify(Merge));
        console.log("Updated changes");
         await displayMessage ()
      }
      else{
        console.log("no changes");
        await displayMessage ()
      }
    }
    catch (err){
        console.log(err);

    }
}
async function displayMessage (){
    
    try{
        Messages.innerHTML ='';
        let Response = [];
        Response = JSON.parse(localStorage.getItem('data'));

       for(let i=0;i<Response.length;i++)
        {
        let li = document.createElement('li');
        li.innerHTML=`<p> ${Response[i]} </p>`
        li.classList.add('messages')
        Messages.appendChild(li);
        }
         window.onload = await scrollToBottom();
     }
    catch(err){
        console.log(err);
    }
} 




