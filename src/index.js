const tasks = new Map();
const isDone = new Map();

const form = document.querySelector('.todo-app__create-new');
const ul = document.querySelector('.todo-app__task-list');
const selectAllButton = document.querySelector('.todo-app__select-all')
const counterLabel = document.querySelector('.actions-bar__active-counter')
const allButton = document.getElementById('show_all')
const activeButton = document.getElementById('show_active')
const completedButton = document.getElementById('show_completed')
const clearCompletedButton = document.querySelector('.clear_completed')


function createTaskInfo(desc) {
    return {
        id: Date.now(),
        desc: desc
    }
}

function addTask(e) {
    e.preventDefault();

    const taskInfo = createTaskInfo(this.description.value);

    if(taskInfo.desc === ''){
        return;
    }

    const task = createLi(taskInfo);

    tasks.set(task.id, task);
    isDone.set(task.id, false);

    showTasks()
    updateCounter();
    this.reset();
}

function createLi(task) {
    const li = document.createElement('li');
    li.id = task.id;
    li.className = 'task_in_list';

    const div = document.createElement('div');
    div.className = 'task';
    div.id = task.id;

    const input = document.createElement('input');
    input.id = task.id;
    input.type = 'checkbox';
    input.className = 'task_status';
    input.ariaLabel = 'Отметить задачу';

    const label = document.createElement('label');
    label.className = 'task_status_icon';
    label.htmlFor = task.id;

    const span = document.createElement('span');
    span.className = 'task_text';
    span.textContent = task.desc;

    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.className = 'delete_btn';
    deleteButton.title = 'Удалить задачу';

    div.append(input, label, span, deleteButton);

    li.append(div);

    return li;
}

function showTasks() {
    ul.innerHTML = '';

    tasks.forEach((value, key) => {
        if (allButton.checked) {
            ul.appendChild(value);
        } else if (activeButton.checked && isDone.get(key) === false) {
            ul.appendChild(value);
        } else if (completedButton.checked && isDone.get(key) === true) {
            ul.appendChild(value);
        }
    });

}

function clearCompleted() {
    ul.childNodes.forEach(li => {
        if (isDone.get(li.id) === true) {
            // Удаление всех listener'ов c кнопки.
            let button = li.querySelector('.delete_btn');
            let buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);

            tasks.delete(li.id);
            isDone.delete(li.id)
        }
    });
    console.log(isDone);
    console.log(tasks);
    showTasks();
}

function selectTaskClick(event){
    target = event.target;
    const li = target.parentNode;

    if (target.className === 'task_status') {
        const span = li.querySelector('.task_text');
        const checkbox = li.querySelector('.task_status');
        if (span.classList.toggle('done')) {
            isDone.set(target.id, true);
            checkbox.checked = true;
        } else {
            isDone.set(target.id, false);
            checkbox.checked = false;
        }
    }

    updateCounter();
}

function deleteTaskClick(event){
    target = event.target;
    const div = target.parentNode;

    if (target.className === 'delete_btn') {
        tasks.delete(div.id);
        isDone.delete(div.id);
        div.remove();
    }

    updateCounter();
}

function selectAll() {
    ul.childNodes.forEach(li => {
        const span = li.querySelector('.task_text');
        const checkbox = li.querySelector('.task_status')
        if (isDone.get(li.id) === false) {
            if (span.classList.toggle('done')) {
                isDone.set(li.id, true);
                checkbox.checked = true;
            }
        }
    });

    updateCounter();
}

function updateCounter() {
    let counter = 0;
    ul.childNodes.forEach(li => {
        if (isDone.get(li.id) === false) {
            counter++;
        }
    })
    counterLabel.textContent = counter.toString() + ' items left';
}


form.addEventListener('submit', addTask)
selectAllButton.addEventListener('click', selectAll);
allButton.addEventListener('click', showTasks);
activeButton.addEventListener('click', showTasks);
completedButton.addEventListener('click', showTasks);
clearCompletedButton.addEventListener('click', clearCompleted);
ul.addEventListener('click', selectTaskClick);
ul.addEventListener('click', deleteTaskClick);