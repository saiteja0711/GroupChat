const loginForm = document.getElementById("loginuser");
let errorMessages = document.getElementById('errorMessages');
let Message = document.getElementById('message');

loginForm.addEventListener('submit',loginUser);
 async function loginUser(e){
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let obj={
        email:email,
        password:password
      }
      errorMessages.innerHTML='';
      Message.innerHTML='';

    try{
        let response= await axios.post('http://localhost:3000/users/login',obj);
         if(response.status === 201)
         {
            localStorage.clear();
            localStorage.setItem('token',response.data.token)
            Message.innerHTML='<h3>User logged in successfully!</h3>'
            document.getElementById('email').value = '';
            document.getElementById('password').value='';
            window.location.href = 'message.html';
         }

    }
    catch(err){
        if(err.response.status === 404)
        {
            errorMessages.innerHTML=`<h3>User not Found</h3>`
        }
        if(err.response.status === 401)
        {
            errorMessages.innerHTML=`<h3> Wrong Password </h3>`
        }
        console.log(err);
    }
 }