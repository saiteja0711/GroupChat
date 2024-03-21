
let messageForm = document.getElementById('sendMessage');
let Chat = document.getElementById('messages');
let token =localStorage.getItem('token');
let Users = document.getElementById('users')
let Messages = document.getElementById('messages');
let AddGroupBtn = document.getElementById('add-group')
let groupsList = document.getElementById("groups")
let messagesContainer = document.querySelector('.messages-container');
messageForm.addEventListener('submit',send);
let lastMessageId =0;
let lastUserGroupId = 0;
const socket = io('http://localhost:3000')

document.addEventListener('DOMContentLoaded',initialize );

AddGroupBtn.addEventListener('click',addGroup);

socket.on('update-messages',async (data) =>{
    
    let groupId = localStorage.getItem('groupId');
    console.log(`${groupId}  ${data.groupId}`)
    if(Number(groupId) === Number(data.groupId))
    {
      await Joined();
     
    }
    else{
        console.log('failed')
    }


});



groupsList.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.classList.contains('show-button')) {
        let groupId = e.target.id;
       localStorage.setItem('groupId',groupId);
       window.location.href = 'message.html';
    }
    else if(e.target.classList.contains('details-button')){
        let groupId = e.target.id;
       localStorage.setItem('groupId',groupId);
       window.location.href = 'group-details.html';
    }
});

async function send(e)
{
    e.preventDefault();
    
    if(localStorage.getItem('groupId') !== null)
    {
        let file = document.getElementById('fileInput').files[0];
        let message = document.getElementById('messageInput').value;
        let groupId = localStorage.getItem('groupId');
        let formData
        if(file)
        {
        formData = new FormData();
        formData.append("fileInput",file);
        console.log([...formData]);
        }
        addMessage(groupId,formData,message)
        
    }
    else{
        alert('select a group to Message')
    }

}

async function addGroup(){
    window.location.href = 'groups.html';
}

async function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
async function initialize() {

    await showUserGroups();
    if( localStorage.getItem('groupId')!== null)
   {
    await Joined()
   }
    
   
}
async function showUserGroups(){
    try {
        let response = await axios.get('http://localhost:3000/groups/usergroups',{
            headers : {Authorization :token}
        })
        //console.log(response);
        for(let i =0; i<response.data.length;i++)
        {
            console.log(response.data[i]);
            let li = document.createElement('li');
            li.innerHTML=`<div class="group-name"><h3>${response.data[i].groupname}</h3>
                        <button class="show-button" id=${response.data[i].id}>Chat</button>
                        <button class="details-button" id=${response.data[i].id}>Details</button></div>`
            groupsList.appendChild(li);
        }
    }
    catch (err){
        console.log(err);
    }
}
async function addMessage(groupId,file,message){
    
    
    
    let obj ={
        message:message,
        groupId:groupId
    } 
    try{
        if(file)
        {
          let response = await axios.post(`http://localhost:3000/chat/files?groupId=${groupId}`, file,{
                headers:{Authorization:token ,"Content-Type": "multipart/form-data"}}) 
                document.getElementById('fileInput').value='';

        }
        if(message)
        {
            let response = await axios.post('http://localhost:3000/chat/messages',obj,{
                headers : {Authorization :token}})
            document.getElementById('messageInput').value ='';
       }
        socket.emit('chat-sent',groupId)
        
         //await addToLocalStorage ();

     }
    catch (err){
        console.log(err)

    }
}


async function Joined(){
    let groupId = localStorage.getItem('groupId');
    try{
        let Response = await axios.get(`http://localhost:3000/chat/users?groupId=${groupId}&offset=${0}`);
        //console.log(Response.data.users[0].name)
        
        Users.innerHTML='';
        if(Response.data.users.length >0)
        {
          for(let i=0;i<Response.data.users.length;i++)
          {
          let li = document.createElement('li');
          li.innerHTML=`<p> ${Response.data.users[i].name} joined </p>`
          li.classList.add('joined');
          Users.appendChild(li);
          }
        }
       
       await addToLocalStorage ();
       //setTimeout(async()=>{await Joined() }, 5000);
    }
    catch(err){
        console.log(err);
    }
} 
async function displayUsers (){
    let groupId = localStorage.getItem('groupId')
    let users = [];
    if( localStorage.getItem(`groupId-${groupId} Users`)!== null)
   {
      users= JSON.parse(localStorage.getItem(`groupId-${groupId} Users`));
      for(let i=0;i<users.length;i++)
        {
          let li = document.createElement('li');
          li.innerHTML=`<p> ${users[i].name} joined </p>`
          li.classList.add('joined');
          Users.appendChild(li);
        }
   }

}
async function addToLocalStorage ()
{
    let groupId = localStorage.getItem('groupId')
    if( localStorage.getItem(`lastMessageId-${groupId}`)!== null)
   {
      lastMessageId = localStorage.getItem(`lastMessageId-${groupId}`);
   }
    try{
    let Response = await axios.get(`http://localhost:3000/chat/messages?Lstid=${lastMessageId}&groupId=${groupId}`);
    //console.log(Response.data.response[0].user.name);
    

      if(Response.data.response.length > 0)
      {
        let newMsg =[];
        let length = Response.data.response.length;
        //console.log("Array >>>>>>>",Response.data.response[0])
        for(let i=0;i<length;i++)
        {
            let data = Response.data.response[i];
            if(data.filetype === 'none')
            {
            console.log(`${data.user.name} : ${data.message}`);
            newMsg.push(`${data.user.name} : ${data.message}`);
            }
            else{
                newMsg.push(data);
            }
        }
        localStorage.setItem(`lastMessageId-${groupId}`,Response.data.response[length-1].id)
        //console.log("last id >>>>>>>>>>",lastMessageId)
        let oldMsg =[];
        if( localStorage.getItem(`GroupId-${groupId}`)!== null)
        {
         oldMsg =JSON.parse( localStorage.getItem(`GroupId-${groupId}`));
        }
        let Merge =[]
        Merge = oldMsg.concat(newMsg);
        if(Merge.length >= 1000)
        {
            Merge.splice(0,Merge.length-1000)
        }
        localStorage.setItem(`GroupId-${groupId}`,JSON.stringify(Merge));
        console.log("Updated changes");
         
      }
      else{
        console.log("no changes");
        
      }
      await displayMessage (groupId)
    }
    catch (err){
        console.log(err);

    }
}
async function displayMessage (groupId){
    
    try{
        Messages.innerHTML ='';
        let Response = [];
        Response = JSON.parse(localStorage.getItem(`GroupId-${groupId}`));
        if (Response && Response.length > 0) { 
            for (let i = 0; i < Response.length; i++) {
                console.log(Response[i].filetype);
                let li = document.createElement('li');
                if(typeof Response[i] === 'string')
                {
                   
                    li.innerHTML = `<p>${Response[i]}</p>`;
                }
                else if(Response[i].filetype === 'image'){
                   
                    li.innerHTML =`<p>${Response[i].user.name}</p>
                              <img src=${Response[i].message} alt ='not Loded' width="300" height="auto"> `;
                   
                }
                else if(Response[i].filetype === 'video')
                {
                    li.innerHTML =`<p>${Response[i].user.name}</p>
                    <video width="400" height= auto controls>
                    <source src=${Response[i].message} type="video/mp4">
                    Your browser does not support the video tag.
                    </video> `;
                }
                else if(Response[i].filetype === 'audio')
                {
                    li.innerHTML =`<p>${Response[i].user.name}</p>
                    <audio width="400" height= auto controls>
                    <source src=${Response[i].message} type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>`

                }
                else if(Response[i].filetype === 'file not supported')
                {
                    li.innerHTML =`<p>${Response[i].user.name}</p>
                    <p>Your browser does not support the audio element.
                    </p>`
                }
                li.classList.add('messages');
                Messages.appendChild(li);
            }
            window.onload = await scrollToBottom();
        } else {
            // Handle when the array is empty
            let li = document.createElement('li');
            li.innerHTML = "<p>No messages yet.</p>";
            li.classList.add('messages');
            Messages.appendChild(li);
     }
    }
    catch(err){
        console.log(err);
    }
} 




