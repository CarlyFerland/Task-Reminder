// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');

    // Event Listener for adding a task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get task value and due date from inputs
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        if (task === '' || dueDate === '') return; // Prevent empty tasks or due dates

        // Create a new task item (li)
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.innerHTML = `<span>${task} - Due: ${dueDate}</span> 
                        <div class="task-buttons">
                          <a href="#" class="btn-small edit-item">Edit</a>
                          <a href="#" class="btn-small delete-item">Delete</a>
                        </div>`;

        // Append task to the list
        taskList.appendChild(li);

        // Clear the input fields after adding the task
        taskInput.value = '';
        dueDateInput.value = '';
    });

    // Event Listener for editing or deleting a task
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-item')) {
            e.target.closest('.collection-item').remove();
        } else if (e.target.classList.contains('edit-item')) {
            const taskDetails = e.target.closest('.collection-item').querySelector('span').textContent;
            const [taskText, dueDateText] = taskDetails.split(' - Due: ');
            taskInput.value = taskText;
            dueDateInput.value = dueDateText; 
            e.target.closest('.collection-item').remove();
        }
    });
});
