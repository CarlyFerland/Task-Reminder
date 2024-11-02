# Simple Task Reminder

A simple task reminder PWA (Progressive Web App) to help you manage daily tasks with due dates.
Made by Carly Ferland
## Features
- Add, edit, and delete tasks with due dates.
- Works offline using service worker caching.
- Installable on mobile devices and desktops as a standalone app.

## Files

- **`index.html`**: The main HTML structure for the app, including input fields for task name and due date.
- **`app.js`**: Handles task creation, editing, and deletion logic, as well as the addition of due dates.
- **`style.css`**: Provides styling for the app.
- **`manifest.json`**: Describes the app metadata for the PWA.
- **`service-worker.js`**: Handles caching and offline functionality.

## PWA Components

### 1. Service Worker
The `service-worker.js` file is responsible for enabling offline functionality by caching important resources.

- **Install Event**: Caches the essential files (`index.html`, `style.css`, `app.js`, and external CSS) when the service worker is installed.
- **Activate Event**: Cleans up old caches to ensure that users have the latest version.
- **Fetch Event**: Serves files from the cache when offline, allowing the app to function without an internet connection.

### 2. Caching Strategy
The app uses a **Cache-First** strategy:
- During the fetch event, it first checks if the requested resource is available in the cache.
- If it is, the cached version is served.
- If not, it fetches the resource from the network and adds it to the cache for future requests.

### 3. Web App Manifest
The `manifest.json` file contains essential information about the app, enabling users to install it on their devices.

#### Key Properties
- **name**: Full name of the app.
- **short_name**: Name used when space is limited.
- **description**: A short description of the app.
- **icons**: Different sizes of app icons for various device screens.
- **start_url**: Specifies the starting page of the app when launched.
- **display**: `standalone` mode removes browser UI, making it feel like a native app.
- **background_color** and **theme_color**: Colors that appear on the app’s splash screen and in the browser header.

## How to Use
1. **Install**: The app can be installed from the browser's menu by selecting the "Install" option.
2. **Add a Task with Due Date**: 
   - Type the task name in the input field labeled "Add a new task."
   - Select a due date in the date input field below the task name.
   - Click "Add Task" to add the task to the list. The task, along with its due date, will appear in the task list.
3. **Edit or Delete a Task**: 
   - Click "Edit" or "Delete" next to a task item to modify or remove it.
   - The edit function will allow you to update both the task name and due date.

## Running Locally
To run this app locally, follow these steps:

1. Open your terminal and navigate to the project folder.
2. Run a local server (e.g., `Live Server` in VS Code or Python's `http.server`).
3. Access the app in your browser at `http://localhost:5500` (or your local server's port).


