let message = document.querySelector('#Entermessage');
let sendBtn = document.querySelector('#sendbtn');
let messageList = document.querySelector('ul');

sendBtn.onclick = sendMessage;

async function sendMessage(){
  let usermessage = message.value;
  console.log(usermessage);
  let p = document.createElement('p');
  p.textContent = "YOU : "+ usermessage;
  messageList.appendChild(p);
  let response = await sendToApi(usermessage);
  console.log(response);
}

async function sendToApi(message){
    try{
  console.log(message);
  let token = localStorage.getItem('Token');
  let obj = {
    Message : message,
    "authorization" : token
  }
  let response = await axios.post('http://localhost:8000/messages/sendmessage',obj);
  return response;
}
catch(err){
  console.log(err);
}
}