let messagesCount=0;

var selectedGroup;


window.addEventListener('DOMContentLoaded',ShowwelcomeMessage);

let messagelist = document.querySelector('#messagelist');
function ShowwelcomeMessage(){
  let welcome = document.createElement('h2');
  welcome.id = "welcome";
  welcome.textContent = "Welcome to Group Chat App Select a group to View Messages";
  messagelist.appendChild(welcome);
}


// new group 
let NewGroupBtn = document.querySelector('#newgroupbtn');
let formclosebtn = document.querySelector('#closeform');
let Newgroupbox = document.querySelector('#newGroupform');
let submitform = document.querySelector('#creategroupform');

NewGroupBtn.addEventListener('click',async()=>{
  let token = localStorage.getItem('Token');
  let response = await axios.get('http://localhost:8000/group/getallmembers',{ headers : {'authorization' : token} })
  let Allusers = response.data.Allusers
  console.log(Allusers);

  addToSelectList(Allusers);
})

let count = 0;
let allusers;
function addToSelectList(Allusers) {
  allusers = Allusers;
  if(count>0){
    Newgroupbox.style. visibility = 'visible';
    return
  }
  var selectElements = document.getElementById("totalusers");
  console.log(selectElements);
  Allusers.forEach(Element=>{
    let option = document.createElement('option');
    option.textContent = Element.Username
    selectElements.appendChild(option);
  })
    $(selectElements).selectpicker('refresh');
  Newgroupbox.style. visibility = 'visible';
  count++;
}

formclosebtn.addEventListener('click',()=>{
  Newgroupbox.style. visibility = 'hidden';
})

let groupName = document.querySelector('#groupnameinput');;


submitform.onsubmit = createGroup;

async function createGroup(e) {
  try{
    e.preventDefault();
  let GroupName = groupName.value;
  
  var selectedValues = [];
  var selectElement = document.getElementById("totalusers");
  for (var i = 0; i < selectElement.options.length; i++) {
    var option = selectElement.options[i];
    if (option.selected) {
      selectedValues.push(option.value || option.text);
    }
  }
 let selectedaddedId = [];

selectedValues.forEach(selected=>{
  allusers.forEach(user=>{
    if(user.Username===selected){
      selectedaddedId.push({
        Id : user.Id,
        Username : user.Username
      })
    }
  })
})
let thisuser = localStorage.getItem('Username');

let NewgroupObj = {
  GroupName : GroupName,
    GroupMembers : selectedaddedId,
    CreatedBy : thisuser
  }
  console.log(NewgroupObj);
  
  let token = localStorage.getItem('Token');
  
  let response = await axios.post('http://localhost:8000/group/creategroup',NewgroupObj,{ headers : { "authorization" : token } });
  console.log(response);
  if(response.data.message==='successfully created'){
    alert('New Group created successfully');
    Newgroupbox.style. visibility = 'hidden';
    let Createdgroup = response.data.createdgroup;
    console.log(Createdgroup);
    let localGroupdata = JSON.parse(localStorage.getItem('Allgroups'));
    if(localGroupdata===null || localGroupdata.length === 0){
         localGroupdata = [];
    }
    else{
      localGroupdata.push(Createdgroup);
      localStorage.setItem('Allgroups',JSON.stringify(localGroupdata));   
    }
    console.log(Createdgroup.GroupName);
    displayGroups([Createdgroup]);
  }
}
catch(err){
  console.log(err);
  alert('some error occured');
}
}


//getting all groups list
let refreshGroupBtn = document.querySelector('#refreshgroup');

refreshGroupBtn.addEventListener('click',getAllgroups);

let  grouprefreshCount = 0;
async function getAllgroups(){
  if(grouprefreshCount!=1){
    let token = localStorage.getItem('Token');
    let response = await axios.get('http://localhost:8000/group/getallgroups',{headers : {"authorization" : token }})
    console.log(response);
    let Allgroups = response.data.Allgroups;
    localStorage.setItem('Allgroups',JSON.stringify(Allgroups));
    document.querySelector('#grouplist').textContent="";
    displayGroups(Allgroups);
    grouprefreshCount = 1;
  }
}

// when domcontend loaded

window.addEventListener('DOMContentLoaded',listallGroups);

function listallGroups(){
  let Allgroups = JSON.parse(localStorage.getItem('Allgroups'));
  if(Allgroups){
    displayGroups(Allgroups);
  }
  else{
    getAllgroups();
  }
}

let Grouplist = document.querySelector('#grouplist'); 

// displaying groupslist and added event listener to get all messages with respect to when clicked

var backcount=0;
function displayGroups(Allgroups){
  console.log(Allgroups);
  Allgroups.forEach(group=>{
    let groupname = group.GroupName;
    let h2 = document.createElement('h2');
    h2.id = "groupname";
    h2.textContent = groupname;
    h2.style.backgroundColor="#c8c8c8"
    h2.addEventListener('click',async()=>{
      try{
        let messagelist = document.querySelector('#messagelist');
        messagelist.textContent='';
        document.querySelector('.groupname').textContent=groupname;
        document.querySelector('#chatingbox').style.display='block';
        let selectedGroup = h2.textContent
        let localGroups = JSON.parse(localStorage.getItem('Allgroups'));
        let myGroupId;
        localGroups.forEach(group=>{
          if(group.GroupName===selectedGroup){
             myGroupId = group.id;
          }
        })
        console.log("selected group's ID = "+myGroupId);

     let localmessage = localStorage.getItem(groupname);
  if(localmessage){
    let localmessages = JSON.parse(localmessage);
      console.log(localmessages);
      assembleData(localmessages);
   }
   else{
    let messagesfromApi = await getmessagesApi(myGroupId,0);
    if(messagesfromApi.length>0){
      localStorage.setItem(groupname,JSON.stringify(messagesfromApi));
      assembleData(messagesfromApi);
    }
    else{
      let h2 = document.createElement('h2');
      h2.id = "nomessages";
      h2.textContent='No Messages';
      messagelist.appendChild(h2);
       }
     }
   }      
      catch(err){
        console.log(err);
        alert('some error occured');
      }
    })
    h2.addEventListener('click',()=>{
      if (window.matchMedia("(max-width: 480px)").matches) {
            console.log("Screen size is below 480 pixels");
            let groupterminal = document.querySelector('#listofgroups');
            let chatterminal = document.querySelector('#chattingTerminal');
              groupterminal.style.display="none";
              chatterminal.style.display='block';
              if(backcount===0){
                let messagestitle = document.querySelector('#messages');
                let backBtn = document.createElement('button');
                let chatingbox = document.querySelector('#chatingbox');
                backBtn.id = 'backtogroups';
                backBtn.className ='btn btn-warning'
                backBtn.textContent = 'Back'
                messagestitle.appendChild(backBtn);
                backBtn.addEventListener('click',()=>{
                  chatterminal.style.display='none';
                  groupterminal.style.display='block';
                  chatingbox.style.display='none';
                })
                backcount=1;
              }
      }
    })
    h2.addEventListener('mouseenter',()=>{
      h2.style.backgroundColor="#9678b6";
    })
    h2.addEventListener('mouseleave',()=>{
      h2.style.backgroundColor="#c8c8c8";
    })
    Grouplist.appendChild(h2);
  })
}


// calling backend for getting newer messages
setInterval(async()=>{
  let grouptitle = document.querySelector('.groupname').textContent;
  let groupId;
  if(grouptitle!='Group chat') {
    let localGroupmessage =  localStorage.getItem(grouptitle);
    // console.log(localGroupmessage);
    if(localGroupmessage){
        let localGroupmessages = JSON.parse(localGroupmessage);
        console.log(localGroupmessages);
    if(localGroupmessages.length!=0){
     console.log("backend is called for "+grouptitle);
   let lastmessageId = localGroupmessages[localGroupmessages.length-1].Id;
   let groups = JSON.parse(localStorage.getItem('Allgroups'));
   groups.forEach(group=>{
    if(group.GroupName===grouptitle){
      groupId= group.id;
    }
   })

   console.log("last message Id = "+lastmessageId);
    console.log("group Id = "+groupId);
   let messageData = await getmessagesApi(groupId,lastmessageId);
   console.log(messageData);
   if(messageData.length>0){
    console.log('new message arrived')
     let UpdatelocalData = JSON.parse(localStorage.getItem(grouptitle));
      messageData.forEach(message=>{
        UpdatelocalData.push(message);
      })
      
     if(UpdatelocalData.length>30) {
        while(UpdatelocalData.length>30){
          UpdatelocalData.shift();
        }
     }

      localStorage.setItem(grouptitle,JSON.stringify(UpdatelocalData));
      assembleData(messageData);
   }
   else{
     return;
   }
   }
  }
   else{
    let groups = JSON.parse(localStorage.getItem('Allgroups'));
    groups.forEach(group=>{
     if(group.GroupName===grouptitle){
       groupId= group.id;
     }
    })
    console.log(groupId);
   let firstmessageData = await getmessagesApi(groupId,0);
   console.log(firstmessageData);
   if(firstmessageData.length>0){
    localStorage.setItem(grouptitle,JSON.stringify(firstmessageData));
    assembleData(firstmessageData);
    }
   }
  }
},2000);


// calling backend for getting messages with respect to group

async function getmessagesApi(myGroupId,lastmessageId){
try{
  let token = localStorage.getItem('Token');
  let response = await axios.get(`http://localhost:8000/group/getgroupmessages/${lastmessageId}`,{ 
    headers : {  
       'authorization' : token,
       'groupId' : myGroupId
     } 
});
  console.log(response.data.messageData);
  return response.data.messageData;
}
catch(err){
  console.log(err);
  return 0;
}

}


/// sending messages in group

let message = document.querySelector('#Entermessage');
let sendBtn = document.querySelector('#sendbtn');
let messageList = document.querySelector('#messagelist');

document.querySelector('#textform').onsubmit = sendMessage;

async function sendMessage(event){
  event.preventDefault();
  let usermessage = message.value;
  console.log(usermessage);
  let response = await sendMessageToApi(usermessage);
  console.log(response);
}

async function sendMessageToApi(message){
  try{
    console.log(message);
  let groupname = document.querySelector('.groupname').textContent;
  let token = localStorage.getItem('Token');
  let groupId;
  let localGroups = JSON.parse(localStorage.getItem('Allgroups'));
  localGroups.forEach(group=>{
    if(group.GroupName===groupname){
      groupId = group.id;
      } 
  })

  let obj = {
    GroupId : groupId,
    Message : message
  }
  console.log(obj);
  let response = await axios.post('http://localhost:8000/messages/sendmessage',obj,{ headers : { "authorization" : token } });
  document.querySelector('#Entermessage').value = "";
  let localchat = localStorage.getItem(groupname);
  if(!localchat){
  document.querySelector('#nomessages').style.display='none';
  }
  return response;
}

catch(err){
  console.log(err);
}

}



async function assembleData(Groupmessages){
  try{
    Groupmessages.forEach(Element => {
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


let MessageList = document.querySelector('#messagelist');

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

  document.querySelector('#chattingTerminal').scrollTo(0, document.querySelector('#chattingTerminal').scrollHeight || document.documentElement.scrollHeight);
  // document.querySelector('#chattingTerminal').scrollTop = document.querySelector('#chattingTerminal').scrollHeight
}
