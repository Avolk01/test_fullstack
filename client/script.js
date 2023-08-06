const inputBox = document.getElementById("inputTaskBox");
const taskList = document.getElementById("taskList");
let data = [];
const mainURL = 'http://127.0.0.1:5000/api';
const saveURL = 'http://localhost:5000/api/save';

async function addTask(){    
    if (inputBox.value === ""){
        alert("Empty Task");
    }
    else if (isExist(inputBox.value)){
        alert("Task already exist");
    }
    else{
        const item = await createItem(inputBox.value, false, false);  
        taskList.appendChild(item);
    }
    inputBox.value = "";
    saveData();
}

function isExist(name) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.task_name == name)
            return true
    }
    return false;
}

async function createItem(name, isComplete, fromServer) {
    const item = document.createElement("li");        
    item.setAttribute("draggable", "true");
    item.classList.add("item")
    item.innerHTML = name;
    item.addEventListener("dragstart", function (){
        item.classList.add("dragging")
    });
    item.addEventListener("dragend", function (){
        setTimeout(() => {item.classList.remove("dragging")},0);
    });
    if (isComplete) {
        item.classList.toggle("checked");
    }
    if (!fromServer) {
       const res = await fetch(mainURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({task_name: name, is_complete: isComplete}),
        })
        data.push(await res.json());
    }
    return addIcons(item);
}

function addIcons(item) {
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";       
    const img = document.createElement("div");
    item.appendChild(span);
    item.appendChild(img);
    return item;
}

taskList.addEventListener("click", function(e){
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        const taskName = e.target.innerHTML.split('<')[0];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];            
            if(element.task_name == taskName){
                element.is_complete = !element.is_complete;
            }
        } 
    } else if(e.target.tagName === "SPAN") {        
        const taskName = e.target.parentElement.innerHTML.split('<')[0];
        const newData = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if(element.task_name!=taskName){
                newData.push(element);
            }            
        }
        data = newData;
        e.target.parentElement.remove();
    } else if(e.target.tagName === "DIV") {
        
    }
    saveData();
}, false);

taskList.addEventListener("dragover", function(e) {
    const draggingItem = taskList.querySelector(".item.dragging");
    const others = [...taskList.querySelectorAll(".item:not(.dragging)")];
    let nextItem = others.find(elem => {
        return e.clientY <= elem.offsetTop + elem.offsetHeight / 2;
    })
    taskList.insertBefore(draggingItem, nextItem);
    data = [];
    for (let i = 0; i < taskList.children.length; i++) {
        const element = taskList.children[i];
        const taskName = element.innerHTML.split('<')[0];
        const isComplete = element.classList.contains('checked');
        data.push({task_name: taskName, is_complete: isComplete});
    }
    saveData();    
}, false);

function saveData(){    
    console.log(data);
    const postData = {tasks: data};
    fetch(saveURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(postData),
    })
}


function getData(){
    fetch(mainURL).then(async (res) => {
        if (res.ok){         
            data = await res.json();
            data.forEach(async task => {
                const item = await createItem(task.task_name, task.is_complete, true);
                taskList.appendChild(item);
            });
        }
    });     
}

getData();