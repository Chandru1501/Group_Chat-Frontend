let message = document.querySelector('#Entermessage');
let sendBtn = document.querySelector('#sendbtn');
let messageList = document.querySelector('ul');

document.querySelector('form').onsubmit = sendMessage;

window.addEventListener('DOMContentLoaded',getMessages);

async function sendMessage(event){
  event.preventDefault();
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
    Message : message
  }
  let response = await axios.post('http://localhost:8000/messages/sendmessage',obj,{ headers : { "authorization" : token } });
  document.querySelector('#Entermessage').value = "";
  return response;
}
catch(err){
  console.log(err);
}
}

async function getMessages(){
  try{
  let token = localStorage.getItem('Token');
  console.log(token);

  let response = await axios.get('http://localhost:8000/messages/getmessages',{ headers : {"authorization" : token } } )
  console.log(response);

  response.data.Usermessages.forEach(Element => {
    let hour = Element.createdAt.substring(11,13);
    let AmorPm = "AM";
    if(hour>12){
      hour = hour-12
      AmorPm = "PM"
    }
    let minutes = Element.createdAt.substring(14,16);

    myobj = {
      Message : Element.Message,
      Username : Element.user.Username,
      Date : Element.createdAt.substring(0,10).split("-").reverse().join('/'),
      Time : `${hour}:${minutes} ${AmorPm}`
    }
    console.log(myobj);
    ShowOnChatTerminal(myobj);
  });
  }
  catch(err){
    console.log(err);
    alert("error occured")
    return err
  }

}

{/* <p><date id="date">22/05/2022</date><br><name>chandru</name>:<message>helloo</message> <time>10:24 PM</time></p> */}

let MessageList = document.querySelector('ul');

async function ShowOnChatTerminal(obj){

  document.querySelector('nav').style.position = "sticky";

  let p = document.createElement('p');
  let date = document.createElement('date');
  date.id = "date";
  let br = document.createElement('br');
  let name = document.createElement('name');
  let message = document.createElement('message');
  let time = document.createElement('time');
  let hr = document.createElement('hr');
  
  date.textContent = obj.Date;
  p.appendChild(date);
  p.appendChild(br);
  name.textContent = `${obj.Username} : `;
  if(localStorage.getItem('Username') === obj.Username ){
    name.textContent = 'YOU : '
    p.style.textAlign="end"
  }
  else{
    p.style.textAlign="start"
  }
  p.appendChild(name);
  message.textContent = `${obj.Message} `;
  p.appendChild(message);
  
  time.textContent = obj.Time;
  p.appendChild(time);
  MessageList.appendChild(p);
}