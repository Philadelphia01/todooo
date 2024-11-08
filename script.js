let taskInput = document.getElementById('taskInput');
let taskList = document.getElementById('taskList');
let editTask = false;
let currentTask; 

function addTask() {
    const task = taskInput.value.trim();

    if (task === '') {
        alert('Please enter a task');
        return;
    }

    if (editTask) {
        currentTask.firstChild.textContent = task;
        taskInput.value = ''; 
        editTask = false;
        return;
    }

    const li = document.createElement('li');
    
    const taskText = document.createElement('span');
    taskText.textContent = task;  
    li.appendChild(taskText);
    

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.HoverColor = 'purple';

    deleteButton.style.borderRadius = '5px';
    deleteButton.onclick = function() {
        const confirmation = confirm('Are you sure you want to delete this task?');
        if (confirmation) {
            taskList.removeChild(li);
        }
    };

    // Create an update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.style.borderRadius = '5px';
    updateButton.style.backgroundColor = '#FFC107';
    updateButton.style.marginLeft = '10px';
    updateButton.onclick = function() {
        taskInput.value = taskText.textContent;  
        currentTask = li;
        editTask = true;
    };


      // Create a done button
      const doneButton = document.createElement('button');
      doneButton.textContent = 'Done';
      doneButton.style.marginLeft = '10px'; 
      doneButton.onclick = function() {
          taskText.style.textDecoration = 'line-through';  
          taskText.style.color = 'grey';  
          doneButton.disabled = true;
      };

    li.appendChild(deleteButton);  
    li.appendChild(updateButton);  
    li.appendChild(doneButton);    
    taskList.appendChild(li);  

    taskInput.value = ''; 
}
