const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");

const createTaskHandler = () =>
{
    event.preventDefault();
    
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.append(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);

