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
        if(res.response.data.message==='user exists'){
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
    return err;
    }
}
}