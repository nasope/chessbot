const socket = io()

socket.on('connection',message => {
    //createMSG("SERVER",message)
    document.getElementById("online").innerHTML = "ONLINE: "+message
});

function str_obj(str) {
    str = str.split(', ');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}


function createForm(t,i,m,c) {
    const form = {
        "Type":"",
        "ID":"",
        "MSG":"",
        "USERNAME":"",
        "USERID":"",
        "SESSIONTOKEN":""
    }
    form.Type = t
    form.ID = i
    form.MSG = m
    form.USERNAME = c.username
    form.USERID = c.userID
    form.SESSIONTOKEN = c.sessiontoken
    return form;
}

let id = document.body.getElementsByClassName('chat')[0].id

const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});


socket.on(id,form => {
    createMSG(form.USERNAME,form.MSG)
})

//send message to current people in chatroom
addEventListener('submit', e => {
    e.preventDefault()
    id = document.body.getElementsByClassName('chat')[0].id
    const msg = e.target.elements.message.value
    e.target.elements.message.value = "";
    const form = createForm("C",id,msg,cookie)
    createMSG(form.USERNAME,form.MSG)
    socket.emit('server',form);
}) 

function createMSG(name, message) {
    if (message == "") {return;}

    let msg = message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    let p1 = document.createElement("p")
    let p2 = document.createElement("p")
    let p3 = document.createElement("p")
    let div = document.createElement("div")

    let parentdiv = document.getElementById('messages')
    let d = new Date();

    div.setAttribute("style","border:1px; border-style:solid; border-color:#FF0000;padding:10px")

    p1.innerHTML=name
    p2.innerHTML=d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
    p3.innerHTML=msg

    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    parentdiv.appendChild(div);
}