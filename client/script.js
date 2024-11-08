let taskInput = document.getElementById('taskInput');
let taskList = document.getElementById('taskList');
let addTaskBtn = document.getElementById('addTaskBtn');
let updateModal = document.getElementById('updateModal');
let updateInput = document.getElementById('updateInput');
let saveUpdateBtn = document.getElementById('saveUpdateBtn');
let cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
let editTask = false;
let currentTask;

async function addTask() {
    const description = taskInput.value.trim();
    if (description === '') {
        alert('Please enter a task');
        return;
    }

    const response = await fetch('http://localhost:5001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            description, 
            date: new Date().toISOString(),
            done: false 
        })
    });

    const newTask = await response.json();
    renderTask(newTask);
    taskInput.value = ''; 
}

async function loadTasks() {
    const response = await fetch('http://localhost:5001/tasks');
    const tasks = await response.json();
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);  

    const taskText = document.createElement('span');
    taskText.textContent = `${task.description} (Due: ${new Date(task.date).toLocaleString()})`;
    if (task.done) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = 'grey';
    }
    li.appendChild(taskText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.onclick = async () => {
        await fetch(`http://localhost:5001/tasks/${task.id}`, { method: 'DELETE' });
        taskList.removeChild(li);
    };

    const updateButton = document.createElement('button');
    updateButton.textContent = 'update';
    updateButton.onclick = () => {
        currentTask = task;
        updateInput.value = task.description; 
        updateModal.style.display = 'flex'; 
    };

    const doneButton = document.createElement('button');
    doneButton.textContent = 'Done';
    doneButton.onclick = async () => {
        await fetch(`http://localhost:5001/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, done: true })
        });
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = 'grey';
        doneButton.disabled = true;
        updateButton.disabled = true;
    };

    li.appendChild(deleteButton);
    li.appendChild(updateButton);
    li.appendChild(doneButton);
    taskList.appendChild(li);
}

// Save updated task when 'Save' is clicked
saveUpdateBtn.onclick = async () => {
    const updatedDescription = updateInput.value.trim();
    if (updatedDescription === '') {
        alert('Please enter a valid description');
        return;
    }

    const updatedTask = { ...currentTask, description: updatedDescription };
    await fetch(`http://localhost:5001/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
    });

    // Update the task in the list
    const taskItem = document.querySelector(`li[data-id="${currentTask.id}"]`);
    taskItem.querySelector('span').textContent = `${updatedTask.description} (Due: ${new Date(updatedTask.date).toLocaleString()})`;

    // Close the modal
    updateModal.style.display = 'none';
};

// Close the modal when 'Cancel' is clicked
cancelUpdateBtn.onclick = () => {
    updateModal.style.display = 'none';
};

// Close the modal if the user clicks outside the modal content
window.onclick = (event) => {
    if (event.target === updateModal) {
        updateModal.style.display = 'none';
    }
};

// Event listener for the "ADD" button
addTaskBtn.addEventListener('click', addTask);

// Load tasks when the page loads
loadTasks();