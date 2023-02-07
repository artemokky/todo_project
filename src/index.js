import {Task} from "./task";
import {Manager} from "./manager"
import {Viewer} from "./viewer";

const store = new Map();

const ul = document.querySelector('.todo-app__task-list');
const counterLabel = document.querySelector('.actions-bar__active-counter');
const form = document.querySelector('.todo-app__create-new');
const selectAllButton = document.querySelector('.todo-app__select-all')
const allButton = document.getElementById('show_all')
const activeButton = document.getElementById('show_active')
const completedButton = document.getElementById('show_completed')
const clearCompletedButton = document.querySelector('.clear_completed')

async function initStore(){
    const storeData = await Manager.get();
    console.log(storeData);
    storeData.forEach(task => {
        store.set(task.id, new Task(task.id, task.description, task.status));
    })
    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

async function addTask(e) {
    e.preventDefault();

    if(this.description.value === ''){
        return;
    }

    const fakeTask = new Task('', this.description.value, false);
    const response = await Manager.post(fakeTask);
    const id = response.name;

    const trueTask = new Task(id, this.description.value, false);
    await Manager.update(id, trueTask);
    store.set(id, trueTask);

    console.log(store);
    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
    this.reset();
}

function clearCompleted() {
    ul.childNodes.forEach(li => {
        if (store.get(li.id).status === true) {
            // Удаление всех listener'ов c кнопки.
            let button = li.querySelector('.delete_btn');
            let buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            Manager.delete(li.id);
            store.delete(li.id);
        }
    });

    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

function selectTaskClick(event){
    const target = event.target;
    const li = target.parentNode;

    if (target.className === 'task_status') {
        const span = li.querySelector('.task_text');
        const checkbox = li.querySelector('.task_status');
        if (span.classList.toggle('done')) {
            store.get(target.id).status = true;
            checkbox.checked = true;
        } else {
            store.get(target.id).status = false;
            checkbox.checked = false;
        }
        Manager.update(target.id, store.get(target.id));
    }

    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

function deleteTaskClick(event){
    const target = event.target;
    const li = target.parentNode.parentNode;
    if (target.className === 'delete_btn') {
        let button = li.querySelector('.delete_btn');
        let buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        store.delete(li.id);
        Manager.delete(li.id);
        li.remove();
    }
    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

function selectAll() {
    ul.childNodes.forEach(li => {
        const span = li.querySelector('.task_text');
        const checkbox = li.querySelector('.task_status')
        if(store.get(li.id).status === false){
            if (span.classList.toggle('done')) {
                store.get(li.id).status = true;
                Manager.update(li.id, store.get(li.id));
                checkbox.checked = true;
            }
        }
    });
    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

window.addEventListener('load', initStore);
form.addEventListener('submit', addTask);
selectAllButton.addEventListener('click', selectAll);
allButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
activeButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
completedButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
clearCompletedButton.addEventListener('click', clearCompleted);
ul.addEventListener('click', selectTaskClick);
ul.addEventListener('click', deleteTaskClick);
