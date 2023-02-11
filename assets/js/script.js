const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const pageContentEl = document.querySelector("#page-content");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");
let tasks = [];
let taskIdCounter = 0;

const taskFormHandler = (event) => 
{
    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
  
    // check if inputs are empty (validate)
    if (taskNameInput === "" || taskTypeInput === "") 
    {
      alert("You need to fill out the task form!");
      return false;
    }
  
    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;
  
    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    let isEdit = formEl.hasAttribute("data-task-id");
  
    if (isEdit) 
    {
      let taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    else 
    {
      let taskDataObj = 
      {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
      };
  
      createTaskEl(taskDataObj);
    }
};
  
const createTaskEl = (taskDataObj) =>
{
    // create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");

    // give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.append(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    let taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
    tasksToDoEl.append(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

const createTaskActions = (taskId) =>
{
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    let statusChoices = ["To Do", "In Progress", "Completed"];

    for (let i = 0; i < statusChoices.length; i++) 
    {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

const completeEditTask = (taskName, taskType, taskId) =>
{
    // find task list item with taskId value
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (let i = 0; i < tasks.length; i++) 
    {
        if (tasks[i].id === parseInt(taskId)) 
        {
          tasks[i].name = taskName;
          tasks[i].type = taskType;
        }
    }
  
    alert("Task Updated!");
  
    // remove data attribute from form
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    formEl.querySelector("#save-task").textContent = "Add Task";
};

const taskStatusChangeHandler = (event) => 
{
    // get the task item's id
    let taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    let statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") 
    {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") 
    {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") 
    {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) 
    {
        if (tasks[i].id === parseInt(taskId)) 
        {
            tasks[i].status = statusValue;
        }
    }
};

const taskButtonHandler = (event) =>
{
    
    // get target element from event
    let targetEl = event.target;
  
      // edit button was clicked
    if (targetEl.matches(".edit-btn")) 
    {
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) 
    {
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

const editTask = (taskId) => 
{
    // get task list item element
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;

    let taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};
  
const deleteTask = (taskId) =>
{
    console.log(taskId);

    // find task list element with taskId value and remove it
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    let updatedTaskArr = [];

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) 
    {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) 
        {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
