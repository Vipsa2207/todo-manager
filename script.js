document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById("input-box");
    const dueDateInput = document.getElementById("due-date-input");
    const priorityInput = document.getElementById("priority-input");
    const addBtn = document.getElementById("add-btn");
    const listContainer = document.getElementById("list-container");
    
    const filterAllBtn = document.getElementById("filter-all");
    const filterPendingBtn = document.getElementById("filter-pending");
    const filterCompletedBtn = document.getElementById("filter-completed");

    let tasks = [];
    let currentFilter = 'all'; 

    function renderTasks() {
        listContainer.innerHTML = ''; 
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
        });

        if (filteredTasks.length === 0) {
            listContainer.innerHTML = '<p class="no-tasks">No tasks to show for this filter.</p>';
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.dataset.id = task.id; 

            if (task.completed) {
                li.classList.add("checked");
            }
            const formattedDate = task.dueDate 
                ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '';

            li.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-details">
                    <span class="priority ${task.priority}">${task.priority}</span>
                    <span class="due-date">${formattedDate}</span>
                </div>
                <span class="delete-btn">\u00d7</span>
            `;
            listContainer.appendChild(li);
        });

        saveData(); 
    }
    function addTask() {
        const taskText = inputBox.value.trim();
        if (taskText === '') {
            alert("Task description cannot be empty!");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            dueDate: dueDateInput.value,
            priority: priorityInput.value
        };

        tasks.push(newTask);       
        inputBox.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'low';

        renderTasks();
    }
    function handleListClick(e) {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;

        const taskId = Number(li.dataset.id);

        if (target.classList.contains('delete-btn')) {
            
            tasks = tasks.filter(task => task.id !== taskId);
        } else {
           
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.completed = !task.completed;
            }
        }

        renderTasks();
    }
    function updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`filter-${currentFilter}`).classList.add('active');
    }

    function saveData() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function loadData() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        renderTasks();
    }

    addBtn.addEventListener('click', addTask);
    inputBox.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    listContainer.addEventListener('click', handleListClick);

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons();
        renderTasks();
    });

    filterPendingBtn.addEventListener('click', () => {
        currentFilter = 'pending';
        updateFilterButtons();
        renderTasks();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        updateFilterButtons();
        renderTasks();
    });
    loadData();
    updateFilterButtons();
});