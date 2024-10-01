// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');

    // Event Listener for adding a task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get task value from input
        const task = taskInput.value.trim();
        if (task === '') return; // Prevent empty tasks

        // Create a new task item (li)
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.innerHTML = `${task} <div class="task-buttons"><a href="#" class="btn-small edit-item">Edit</a><a href="#" class="btn-small delete-item">Delete</a></div>`;

        // Append task to the list
        taskList.appendChild(li);

        // Clear the input after adding the task
        taskInput.value = '';
    });

    // Event Listener for editing or deleting a task
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-item')) {
            e.target.closest('.collection-item').remove();
        } else if (e.target.classList.contains('edit-item')) {
            const taskText = e.target.closest('.collection-item').childNodes[0].nodeValue.trim();
            taskInput.value = taskText; // Set the input value to the task text for editing
            e.target.closest('.collection-item').remove(); // Remove the task item to allow for re-adding
        }
    });
});
