let message = document.querySelector('#Entermessage');
let sendBtn = document.querySelector('#sendbtn');
let messageList = document.querySelector('ul');
let messagesCount=0;

document.querySelector('form').onsubmit = sendMessage;

window.addEventListener('DOMContentLoaded',checkLocalStorage);

async function sendMessage(event){
  event.preventDefault();
  let usermessage = message.value;
  console.log(usermessage);
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

setInterval(async() => {
  let lastmessages = JSON.parse(localStorage.getItem('MyMessages'));
  // console.log(lastmessages)
  let lastmessageId;
  if(lastmessages==null){
   lastmessageId = 0
  }
  else{
    lastmessageId = lastmessages[lastmessages.length-1].MsgId;
    if(lastmessages.length>70){
      while(lastmessages.length>=70){
        lastmessages.shift();
      }
      console.log(lastmessages.length);
      console.log("local storage length ",lastmessages.length);
      localStorage.setItem('MyMessages',JSON.stringify(lastmessages));
    }
// console.log(lastmessageId);
// console.log("local storage length ",lastmessages.length);
  let newMessage = await fetchUserMessages(lastmessageId);
  if(newMessage.length==0){
    
    return;
  }
  else{
    console.log('New Message');
    assembleData(newMessage,'exist',true);

  }
}
},2000); 

 async function checkLocalStorage(){
   let Usermessages = JSON.parse(localStorage.getItem('MyMessages'));
   if(Usermessages=== null || Usermessages.length === 0 ){
     Usermessages=0;
     let MessageData = await fetchUserMessages(Usermessages);
     console.log(MessageData);
     assembleData(MessageData,'new',false);
   }
   else{
      Usermessages.forEach(Element =>{
        ShowOnChatTerminal(Element);
      })
      console.log(Usermessages);
   }
 }

async function fetchUserMessages(lastmessageId){
  let token = localStorage.getItem('Token');
  // console.log(token);
  let response = await axios.get(`http://localhost:8000/messages/getmessages/:${lastmessageId}`,{ headers : {"authorization" : token } } )
  // console.log(response.data.Usermessages);
  return response.data.Usermessages;
}


let MyMessages = [];

async function assembleData(Usermessages,isNew,loading){
  try{
    Usermessages.forEach(Element => {
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
      // addedmsgID with existing obj
      myObjWithMsgId = {
        MsgId : Element.id,
        Message : Element.Message,
        Username : Element.user.Username,
        Date : Element.createdAt.substring(0,10).split("-").reverse().join('/'),
        Time : `${hour}:${minutes} ${AmorPm}`
      }
      console.log(myObjWithMsgId);
      MyMessages.push(myObjWithMsgId);
  });
  console.log(MyMessages);
  if(isNew==='new'){
    localStorage.setItem('MyMessages',JSON.stringify(MyMessages));
    MyMessages=[];
  }
  else if(isNew=='exist' && loading===true) {
    let oldMessages = JSON.parse(localStorage.getItem('MyMessages'));
    let NewMessages = [...oldMessages,...MyMessages];
    MyMessages=[];
    localStorage.setItem('MyMessages',JSON.stringify(NewMessages));
 }
  }
  catch(err){
    console.log(err);
    alert("error occured")
    return err
   }

 }





let MessageList = document.querySelector('ul');

async function ShowOnChatTerminal(obj){
   
  let removedMsgId = {
    Date : obj.Date,
    Message : obj.Message,
    Time : obj.Time,
    Username : obj.Username
  }
   
  let p = document.createElement('p');
  let date = document.createElement('date');
  date.id = "date";
  let br = document.createElement('br');
  let name = document.createElement('name');
  let message = document.createElement('message');
  let time = document.createElement('time');
  let hr = document.createElement('hr');
  
  date.textContent = removedMsgId.Date;
  p.appendChild(date);
  p.appendChild(br);
  name.textContent = `${removedMsgId.Username} : `;
  if(localStorage.getItem('Username') === removedMsgId.Username ){
    name.textContent = 'YOU : '
    p.style.textAlign="end"
  }
  else{
    p.style.textAlign="start"
  }
  p.appendChild(name);
  message.textContent = `${removedMsgId.Message} `;
  p.appendChild(message);
  
  time.textContent = removedMsgId.Time;
  p.appendChild(time);
  MessageList.appendChild(p);

    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

}