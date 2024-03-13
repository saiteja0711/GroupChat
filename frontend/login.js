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
        let response= await axios.post('http://localhost:3000/user/login',obj);
         if(response.status === 201)
         {
            Message.innerHTML='<h3>User logged in successfully!</h3>'
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