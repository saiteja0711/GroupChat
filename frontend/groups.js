let Form =document.getElementById('addGroupForm');
let token = localStorage.getItem('token')


Form.addEventListener('submit',createGroup);

async function createGroup(e){
    e.preventDefault();
    let groupname = document.getElementById('groupName').value;
    let obj = {
        groupname:groupname
     }
    try{
        let response = await axios.post('http://localhost:3000/groups/addgroup',obj,{
            headers : {Authorization :token}
        })
        document.getElementById('groupName').value='';
        alert('group created sucessfully')
        window.location.href = 'message.html';
    }
    catch (err){
        alert('Try again there is an error')
        console.log(err);

    }

}