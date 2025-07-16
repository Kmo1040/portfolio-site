
//DATE
const dateEl = document.getElementById('date');
const today = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
dateEl.textContent = "Today is " + today.toLocaleDateString('en-US', options);

//GREETING
function setGreeting() {
    const greetingEl = document.getElementById('greeting');
    const now = new Date();
    const hour = now.getHours();
    let greetingText;

    if (hour < 12) {
        greetingText = "\u2600 Good morning, Kat!";
    } else if (hour < 18) {
        greetingText = "\u2601 Good afternoon, Kat!";
    } else {
        greetingText = "\u263d Good evening, Kat!";
    }

    greetingEl.textContent = greetingText;
}

setGreeting();

//TO DO LIST
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

window.addEventListener('load', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskObj => {
        addTaskToDOM(taskObj.text, taskObj.completed, taskObj.priority);
    });
    sortTasks();
});

function addTaskToDOM(taskText, completed = false, priority = false) {
    const li = document.createElement('li');

    //left side - checkbox and task name
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('task-left');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.style.marginRight = '10px';

    const span = document.createElement('span');
    span.textContent = taskText;
    if (completed) {
        span.style.textDecoration = 'line-through';
        li.classList.add('completed-task');
    }

    checkbox.addEventListener('change', () => {
        span.style.textDecoration = checkbox.checked ? 'line-through' : '';
        li.classList.toggle('completed-task', checkbox.checked);

        if (checkbox.checked && li.classList.contains('priority-task')) {
            li.classList.remove('priority-task');
        }

        saveTasks();
        sortTasks();
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    //right side - edit and delete 
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('task-buttons');

    const priorityBtn = document.createElement('button');
    priorityBtn.innerHTML = '🟊';
    priorityBtn.addEventListener('click', () => {
        li.classList.toggle('priority-task');
        saveTasks();
        sortTasks();
    });

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.addEventListener('click', () => {
        const newTask = prompt("Edit task:", span.textContent);
        if (newTask !== null && newTask.trim() !== "") {
            span.textContent = newTask.trim();
            saveTasks();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🞫';
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks();
    });

    buttonsDiv.appendChild(priorityBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(buttonsDiv);

    if (priority) {
        li.classList.add('priority-task');
    } 
    taskList.appendChild(li);

    saveTasks();
    sortTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        const span = li.querySelector('span');
        tasks.push({
            text: span.textContent,
            completed: li.querySelector('input[type="checkbox"]').checked,
            priority: li.classList.contains('priority-task')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleAddTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        addTaskToDOM(taskText);
        taskInput.value = "";
        sortTasks();
    }
}

addTaskBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAddTask();
    }
});

function sortTasks() {
    const tasksArray = [];

    document.querySelectorAll('#task-list li').forEach(li => {
        const span = li.querySelector('span');
        const checkbox = li.querySelector('input[type="checkbox"]');
        tasksArray.push({
            element: li,
            completed: checkbox.checked,
            priority: li.classList.contains('priority-task'),
        });
    });

    tasksArray.sort((a, b) => {
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;

        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        return 0;
    });

    taskList.innerHTML = "";
    tasksArray.forEach(item => {
        taskList.appendChild(item.element);
    });
}

//POMODORO
let timer;
let defaultTime = 25 * 60;
let timeLeft = defaultTime;

const display = document.getElementById("time-counter");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const minutesInput = document.getElementById("minutes-input");
const setTimeBtn = document.getElementById("set-time");

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                console.log("Time's up!");
                document.getElementById("timer-notification").textContent = "Time's up!";
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = defaultTime;
    updateDisplay();
    document.getElementById("timer-notification").textContent = "";
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
setTimeBtn.addEventListener("click", () => {
    const minutes = parseInt(minutesInput.value);
    if (!isNaN(minutes) && minutes > 0) {
        clearInterval(timer);
        timer = null;
        defaultTime = minutes * 60;
        timeLeft = defaultTime;
        updateDisplay();
        document.getElementById("timer-notification").textContent = "";
        minutesInput.value = "";
    } else {
        alert("Please enter a valid number of minutes.");
    }
});
updateDisplay();

//CLASS LIST AND PROGRESS
const courseNameInput = document.getElementById('course-name');
const courseProgressInput = document.getElementById('course-progress');
const addCourseBtn = document.getElementById('add-course-btn');
const courseList = document.getElementById('course-list');

let storedCourses = JSON.parse(localStorage.getItem('courses')) || [
    { name: "Wed Development Foundations", percentComplete: 45 },
    { name: "Network and Security - Foundations", percentComplete: 75 },
    { name: "JavaScript Applications", percentComplete: 20 },
];

storedCourses.forEach((course, index) => addCourseToDOM(course, index));

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(storedCourses));
}

function addCourseToDOM(course, index) {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("course-item");

    if (course.percentComplete === 100) {
        courseDiv.classList.add("completed-course");
    }

    const courseHeader = document.createElement("div");
    courseHeader.classList.add("course-item-header");
    courseHeader.style.display = "flex";
    courseHeader.style.justifyContent = "space-between";
    courseHeader.style.alignItems = "center";

    const courseName = document.createElement("h3");
    courseName.textContent = course.name;
    courseName.style.margin = "0";

    const buttonsDiv = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '✎';
    editBtn.style.marginRight = "5px";
    editBtn.addEventListener("click", () => {
        const newName = prompt("Edit course name:", course.name);
        const newProgress = prompt("Edit Progress %:", course.percentComplete);

        if (newName !== null && newName.trim() !== "" && !isNaN(parseInt(newProgress)) && parseInt(newProgress) >= 0 && parseInt(newProgress) <= 100) {
            course.name = newName.trim();
            course.percentComplete = parseInt(newProgress);
            updateCourseList();
        } else {
            alert("Please enter a valid name and progress (0-100).");
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '🞫';
    deleteBtn.addEventListener("click", () => {
        storedCourses.splice(index, 1);
        updateCourseList();
    });

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    courseHeader.appendChild(courseName);
    courseHeader.appendChild(buttonsDiv);

    courseDiv.appendChild(courseHeader);

    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = `${course.percentComplete}%`;
    progressBar.textContent = `${course.percentComplete}%`;

    progressContainer.appendChild(progressBar);
    courseDiv.appendChild(progressContainer);

    courseList.appendChild(courseDiv);
}

function updateCourseList() {
    courseList.innerHTML = "";

    storedCourses.sort((a, b) => {
        if (a.percentComplete === 100 && b.percentComplete !== 100) {
            return 1;
        } else if (a.percentComplete !== 100 && b.percentComplete === 100) {
            return -1;
        } else {
            return 0;
        }
    });

    storedCourses.forEach((course, index) => addCourseToDOM(course, index));
    saveCourses();
}

addCourseBtn.addEventListener('click', () => {
    const name = courseNameInput.value.trim();
    const progress = parseInt(courseProgressInput.value);

    if (name !== "" && !isNaN(progress) && progress >= 0 && progress <= 100) {
        const newCourse = { name: name, percentComplete: progress };
        storedCourses.push(newCourse);
        updateCourseList();
        courseNameInput.value = "";
        courseProgressInput.value = "";
    } else {
        alert("Please enter a valid course name and progress between 0 and 100.");
    }
});
