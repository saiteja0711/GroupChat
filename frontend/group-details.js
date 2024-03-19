let groupUserList = document.getElementById('groupUserList');
let token =localStorage.getItem('token');
let groupId = localStorage.getItem('groupId')
let searchResultsList = document.getElementById('searchResults');
let Message = document.getElementById('message');
let isGroupAdmin = 0;
let lastUserGroupId = 0;
let UsersinGroup = [];
let AllUsers    = [];

document.addEventListener('DOMContentLoaded', async () =>{
    await IsAdmin();
    await JoinedUsers();
    await allUsers ();
});

async function allUsers (){
    try{
        let response = await axios.get(`http://localhost:3000/group-details/allusers`)
        AllUsers = response.data.users
    }
    catch (err){
        console.log(err);
    }
}


async function searchUsersByEmail(email) {
    
    const searchResults = AllUsers.filter(user => user.email === email);
    return searchResults;
}


document.getElementById('searchButton').addEventListener('click', async() => {
    const searchInput = document.getElementById('searchInput');
    const email = searchInput.value.trim();

    const searchResults = await searchUsersByEmail(email);
   
    searchResultsList.innerHTML = '';
    searchResults.forEach(user => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.classList.add('serchResults');
        const h3 = document.createElement('h3');
        h3.textContent = `${user.name} - ${user.email}`;
        div.appendChild(h3);

        if(UsersinGroup.find(groupUser => groupUser.id === user.id))
        {
            const h4 = document.createElement('h4');
            h4.textContent = `(Already a user of the group)`;
            h4.style.color ='black'; 
            h4.style.opacity = '0.5';
            div.appendChild(h4);
        }
        else
        {
            if (isGroupAdmin)
            {
              const addUserButton = document.createElement('button');
              addUserButton.classList.add('add-user');
              addUserButton.id = user.id;
              addUserButton.textContent = 'Add User';
              div.appendChild(addUserButton);
            }
        }
        li.appendChild(div);
        searchResultsList.appendChild(li);
    });
});




async function IsAdmin(){
    try{
        let response = await axios.get(`http://localhost:3000/group-details/isadmin?groupId=${groupId}`,{
            headers : {Authorization :token}
        })
        //console.log(response);
        if(response.data.isAdmin)
        {
            Message.innerHTML ="<h3>You are an admin </h3>";
            isGroupAdmin = 1;
        }
        else {
            Message.innerHTML ="<h3>You are not an admin</h3>";
        }   
        
        }
    
    catch (err){
        console.log(err);
    }

  }

  async function JoinedUsers(){
    let newusers=[];
    if( localStorage.getItem(`lastUserGroupId -${groupId}`)!== null)
    {
        lastUserGroupId = localStorage.getItem(`lastUserGroupId -${groupId}`);
    }

   try{
        let Response = await axios.get(`http://localhost:3000/chat/users?groupId=${groupId}&offset=${lastUserGroupId}`);
        //console.log(Response.data.users[0].name)
        
        if(Response.data.users.length >0)
        {
          let length  =  Response.data.users.length;
        
          for(let i=0;i<Response.data.users.length;i++)
        {
           newusers.push(Response.data.users[i]);
        }
        
        let oldusers = [];
        if( localStorage.getItem(`groupId-${groupId} Users`)!== null)
        {
            oldusers  =JSON.parse( localStorage.getItem(`groupId-${groupId} Users`));
        }
       
        let Merge =[]
        Merge = oldusers.concat(newusers);

       localStorage.setItem(`groupId-${groupId} Users`,JSON.stringify(Merge));
       localStorage.setItem(`lastUserGroupId -${groupId}`,Response.data.users[length-1].usergroups[0].id);
      }
       await displayUsers ();
    }
    catch(err){
        console.log(err);
    }
} 
async function displayUsers (){
    if( localStorage.getItem(`groupId-${groupId} Users`)!== null)
     {
        UsersinGroup= JSON.parse(localStorage.getItem(`groupId-${groupId} Users`));
     }
     groupUserList.innerHTML='';
     UsersinGroup.forEach( user =>
        {
            let li = document.createElement('li');
            const div = document.createElement('div');
            div.classList.add('groupUsers');
            const h3 = document.createElement('h3');
            h3.textContent = `${user.name} - ${user.email}`;
            div.appendChild(h3);
            

            if (isGroupAdmin)
            {
              if(!(user.usergroups[0].isAdmin))
              {
                const makeAdminButton = document.createElement('button');
                makeAdminButton.classList.add('make-admin');
                makeAdminButton.id = user.id;
                makeAdminButton.textContent = 'Make Admin';
                div.appendChild(makeAdminButton);
              }
                const removeUserButton = document.createElement('button');
                removeUserButton.classList.add('remove-user');
                removeUserButton.id = user.id;
                removeUserButton.textContent = 'Remove';
                div.appendChild(removeUserButton);
            }
            
           li.appendChild(div);
           groupUserList.appendChild(li);
        });
       
    
   }

   groupUserList.addEventListener('click', async(e)=>{
    e.preventDefault();
    if (e.target.classList.contains('make-admin')) {
        let userid = e.target.id;
        
       try{
            let response = await axios.put(`http://localhost:3000/group-details/makeadmin?groupId=${groupId}&userId=${userid}`)
            alert('Sucessfully made admin');
            const index = UsersinGroup.findIndex(obj => 
                {
                    console.log(obj.id)
                    return Number(obj.id) === Number(userid)
                });
            console.log(index);
            console.log(userid);
            UsersinGroup[index].usergroups[0].isAdmin = true;
            localStorage.setItem(`groupId-${groupId} Users`,JSON.stringify(UsersinGroup));
            e.target.remove();
        }
        catch(err){
            console.log(err);
            alert("Try again!...")

        }
    }
    else if(e.target.classList.contains('remove-user')){
        let userid = e.target.id;
        
        try{
             let response = await axios.put(`http://localhost:3000/group-details/removeuser?groupId=${groupId}&userId=${userid}`)
             alert('Sucessfully removed user');
             UsersinGroup= UsersinGroup.filter(obj => Number(obj.id) !== Number(userid));
             localStorage.setItem(`groupId-${groupId} Users`,JSON.stringify(UsersinGroup));
             e.target.parentElement.remove();
         }
         catch(err){
             console.log(err);
             alert("Try again!..")
 
         }
    }
});

searchResultsList.addEventListener('click', async(e)=>{
    e.preventDefault();
    if (e.target.classList.contains('add-user')) {
        let userid = e.target.id;
        let obj ={
            userId:userid,
            groupId:groupId,
            isAdmin:false
        }
       try{
            let response = await axios.post(`http://localhost:3000/group-details/adduser`,obj)
            alert('Sucessfully added User');
            await JoinedUsers();
            e.target.remove();
        }
        catch(err){
            console.log(err);
            alert("Try again!...")

        }
    }
});