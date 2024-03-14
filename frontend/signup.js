let signupForm = document.getElementById('createuser');
signupForm.addEventListener('submit',signup)
let errorMessages = document.getElementById('errorMessages');
let Message = document.getElementById('message');

async function signup(e){
    e.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phonenumber = document.getElementById('phonenumber').value;
    let password = document.getElementById('password').value;

    let obj={
        name:name,
        email:email,
        phonenumber:phonenumber,
        password:password
      }
      errorMessages.innerHTML='';
      Message.innerHTML='';
      try{
         let response = await axios.post('http://localhost:3000/users/signup',obj);
         if(response.status === 201)
         {
            Message.innerHTML=`<h3> Successfuly signed up </h3>`
         }
      }
      catch (err){
        if(err.response.status === 401)
        {
            errorMessages.innerHTML=`<h3> User already exists, Please Login </h3>`
        }
        console.log(err);

      }
}