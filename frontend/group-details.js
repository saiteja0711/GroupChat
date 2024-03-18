let groupUserList = document.getElementById('groupUserList');
let token =localStorage.getItem('token');
let groupId = localStorage.getItem('groupId')
let Message = document.getElementById('message');
let isGroupAdmin = 0;
let UsersinGroup = [];
let AllUsers    = [];
if( localStorage.getItem(`groupId-${groupId} Users`)!== null)
   {
    UsersinGroup= JSON.parse(localStorage.getItem(`groupId-${groupId} Users`));
   }

document.addEventListener('DOMContentLoaded', async () =>{
    await IsAdmin();
    await groupUsers();
    await allUsers ()

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

// Function to search for users by email
function searchUsersByEmail(email) {
    const searchResults = AllUsers.filter(user => user.email === email);
    return searchResults;
}

// Function to handle search button click
document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    const email = searchInput.value.trim();

    const searchResults = searchUsersByEmail(email);
    const searchResultsList = document.getElementById('searchResults');
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
            h4.textContent = `Already a user of the group`;
            div.appendChild(h4);
        }
        else{
            const addUserButton = document.createElement('button');
            addUserButton.classList.add('add-user');
            addUserButton.id = user.id;
            addUserButton.textContent = 'Add User';
            div.appendChild(addUserButton);
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
async function groupUsers(){
        
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
            alert('Sucessfully made admin')
        }
        catch(err){
            console.log(err);
            alert("Try again!...")

        }
    }
    else if(e.target.classList.contains('details-button')){
        let userid = e.target.id;
        try{
             let response = await axios.put(`http://localhost:3000/group-details/removeuser?groupId=${groupId}&userId=${userid}`)
             alert('Sucessfully removed user')
         }
         catch(err){
             console.log(err);
             alert("Try again!..")
 
         }
    }
});