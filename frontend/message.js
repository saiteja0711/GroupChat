let messageForm = document.getElementById('sendMessage');
let Chat = document.getElementById('messages');
let token =localStorage.getItem('token');
let Users = document.getElementById('users')
let Messages = document.getElementById('messages')
messageForm.addEventListener('submit',addMessage);
document.addEventListener('DOMContentLoaded', Joined)
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
        window.location.href = 'message.html';
     }
    catch (err){
        console.log(err)

    }
}

async function Joined(){
   try{
        let Response = await axios.get('http://localhost:3000/chat/users');
        //console.log(Response.data.users[0].name)
        
        for(let i=0;i<Response.data.users.length;i++)
        {
        let li = document.createElement('li');
        li.innerHTML=`<p> ${Response.data.users[i].name} joined </p>`
        li.classList.add('joined')
        Users.appendChild(li);
       }
       displayMessage ();
    


    }
    catch(err){
        console.log(err);
    }
} 

async function displayMessage (){
    Messages.innerHTML ='';
    try{
        let Response = await axios.get('http://localhost:3000/chat/messages'); 
        //console.log(Response.data.response[0].user.name)
        
        for(let i=0;i<Response.data.response.length;i++)
        {
         let data = Response.data.response[i];
        let li = document.createElement('li');
        li.innerHTML=`<p> ${data.user.name} : ${data.message} </p>`
        li.classList.add('messages')
        Messages.appendChild(li);
        }
    }
    catch(err){
        console.log(err);
    }
} 




