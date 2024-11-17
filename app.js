import { db } from './firebaseConfig.js';
import { collection, addDoc, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

// Set up IndexedDB for offline storage
const dbPromise = openDB('task-reminder-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
            db.createObjectStore('tasks', { keyPath: 'id' });
        }
    },
});

// Function to save task offline in IndexedDB with a unique ID
async function saveTaskOffline(taskData) {
    const db = await dbPromise;
    const tx = db.transaction('tasks', 'readwrite');
    await tx.store.add({ ...taskData, id: `temp-${Date.now()}` }); // Assign temporary unique ID
    console.log("Task saved to IndexedDB:", taskData);
}

// Function to delete task offline from IndexedDB
async function deleteTaskOffline(id) {
    const db = await dbPromise;
    const tx = db.transaction('tasks', 'readwrite');
    await tx.store.delete(id);
    console.log("Task deleted from IndexedDB:", id);
}

// Function to load tasks from IndexedDB
async function loadTasksFromIndexedDB() {
    const db = await dbPromise;
    const tasks = await db.getAll('tasks');
    tasks.forEach(task => renderTask(task.id, task.task, task.dueDate));
}

// Function to sync offline tasks from IndexedDB to Firestore
async function syncOfflineTasks() {
    console.log("App is back online. Syncing offline tasks...");
    const db = await dbPromise;
    const tasks = await db.getAll('tasks');
    for (const task of tasks) {
        try {
            if (task.id.startsWith('temp-')) {  // Only sync tasks added offline
                const docRef = await addDoc(collection(db, "tasks"), {
                    task: task.task,
                    dueDate: task.dueDate,
                    timestamp: task.timestamp
                });
                await deleteTaskOffline(task.id); // Remove from IndexedDB after syncing
                console.log("Offline task synced to Firestore:", docRef.id);
            }
        } catch (error) {
            console.error("Error syncing task:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');

    // Function to render a task item in the list
    function renderTask(id, task, dueDate) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.dataset.id = id;
        li.innerHTML = `<span>${task} - Due: ${dueDate}</span> 
                        <div class="task-buttons">
                          <a href="#" class="btn-small edit-item">Edit</a>
                          <a href="#" class="btn-small delete-item">Delete</a>
                        </div>`;
        taskList.appendChild(li);
    }

    // Load tasks from Firestore if online, otherwise from IndexedDB
    if (navigator.onLine) {
        loadTasksFromFirestore();
    } else {
        loadTasksFromIndexedDB();
    }

    // Load tasks from Firestore
    async function loadTasksFromFirestore() {
        try {
            const querySnapshot = await getDocs(collection(db, "tasks"));
            querySnapshot.forEach((doc) => {
                const taskData = doc.data();
                renderTask(doc.id, taskData.task, taskData.dueDate);
            });
        } catch (error) {
            console.error("Error loading tasks from Firestore:", error);
        }
    }

    // Event Listener for adding a task
    taskForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        if (task === '' || dueDate === '') return;

        const taskData = { task, dueDate, timestamp: new Date() };

        if (navigator.onLine) {
            try {
                const docRef = await addDoc(collection(db, "tasks"), taskData);
                renderTask(docRef.id, task, dueDate);
                console.log("Task added to Firestore:", docRef.id);
            } catch (error) {
                console.error("Error adding task to Firestore:", error);
            }
        } else {
            await saveTaskOffline(taskData);
            renderTask(`temp-${Date.now()}`, task, dueDate); // Render with temporary ID
        }

        taskInput.value = '';
        dueDateInput.value = '';
    });

    // Event Listener for deleting a task
    taskList.addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete-item')) {
            const taskElement = e.target.closest('.collection-item');
            const taskId = taskElement.dataset.id;

            if (navigator.onLine) {
                try {
                    await deleteDoc(doc(db, "tasks", taskId));
                    taskElement.remove();
                    console.log("Task deleted from Firestore with ID:", taskId);
                } catch (error) {
                    console.error("Error deleting task from Firestore:", error);
                }
            } else {
                await deleteTaskOffline(taskId);
                taskElement.remove();
            }
        } else if (e.target.classList.contains('edit-item')) {
            const taskElement = e.target.closest('.collection-item');
            const taskDetails = taskElement.querySelector('span').textContent;
            const [taskText, dueDateText] = taskDetails.split(' - Due: ');
            taskInput.value = taskText;
            dueDateInput.value = dueDateText;
            taskElement.remove();
        }
    });

    // Sync offline tasks when online
    window.addEventListener('online', syncOfflineTasks);
});
