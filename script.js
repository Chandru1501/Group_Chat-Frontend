let page = document.querySelector('#page').textContent;
console.log(page);

if(page==="Signup")  { 

let Username = document.querySelector('#name');
let Email = document.querySelector('#email');
let Phone = document.querySelector('#phone');
let Password = document.querySelector('#password');
let ConfirmPw = document.querySelector('#confirmPw');
let forms = document.querySelector('form');
let mismatch = document.querySelector('#mismatch');
let exists  = document.querySelector('#exist');
let btn = document.querySelector('#signupbtn')

btn.addEventListener('click',()=>{
    mismatch.style.display='none';
    exists.style.display='none';
})

forms.onsubmit = signup;

async function signup (event) {
    event.preventDefault();

    let obj = {
        Name : Username.value,
        Email : Email.value,
        Phone : Phone.value,
        Password : Password.value
    }
    console.log(obj);
    
    if( Password.value === ConfirmPw.value ) {
        let res = await postUser(obj);
        console.log(res)
        if(res.data.message==='somthing went wrong'){
            alert("Something Went Wrong Please try again later")
        }
        if(res.data.message==='success'){
            alert("Signup Successfull please Login to continue")
            location.replace('./login.html');
        }
        if(res.data.message==='user exists'){
            exists.style.display="block";
        }
    } else{
         mismatch.style.display = "block"
       } 
}

async function postUser(myobj){
    try{
    let response = await axios.post('http://localhost:8000/user/signup',myobj);
    console.log(response);
    return response
    }
    catch(err){
    return err.response;
    }
}
}

if(page==="Login")  {
  let Email = document.querySelector('#loginemail')
  let Password = document.querySelector('#loginpassword')
  let loginBtn = document.querySelector('#loginbtn')
  let notFound = document.querySelector('#usernotfound')
  let wrongPw = document.querySelector('#wrongpassword')
  let form = document.querySelector('form');

  form.onsubmit = login;

  loginBtn.addEventListener('click',()=>{
    notFound.style.display='none'
    wrongPw.style.display='none'
  })

  async function login(event){
    event.preventDefault();
    let obj = {
        Email : Email.value,
        Password : Password.value
    }
    console.log(obj)
    let res = await loginApi(obj)
    console.log(res);
    if(res.data.message==='something wrong'){
        alert("Something Went Wrong Please try again later")
    }
    if(res.data.message==='usernotfound'){
        notFound.style.display='block';
    }
    if(res.data.message==='incorrect password'){
        wrongPw.style.display='block';
    }
    if(res.data.message==='login successfull'){
        alert("Login successfull");
        let token = res.data.Token;
        console.log(token);
        localStorage.setItem('Token',token);
    }
  }

  async function loginApi(obj){
    try{
        let response = await axios.post('http://localhost:8000/user/login',obj)
        return response;
    }
    catch(err){
        return err.response;
    }
  }

} 