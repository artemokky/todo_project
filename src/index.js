import {Task} from "./task";
import {TaskModule, UserModule} from "./module"
import {Viewer} from "./viewer";
import {createAuthForm} from "./viewer";
import {User} from "./style/user";

const GENERAL_STORAGE = 'storage';

let token = GENERAL_STORAGE;

const store = new Map();

const modal = createAuthForm("Authorization");
const logoutBtn = document.getElementById('logout_button');
const authBtn = document.getElementById('modal_button');
const ul = document.querySelector('.todo-app__task-list');
const counterLabel = document.querySelector('.actions-bar__active-counter');
const form = document.querySelector('.todo-app__create-new');
const selectAllButton = document.querySelector('.todo-app__select-all')
const allButton = document.getElementById('show_all')
const activeButton = document.getElementById('show_active')
const completedButton = document.getElementById('show_completed')
const clearCompletedButton = document.querySelector('.clear_completed')

window.addEventListener('load', initStore);
authBtn.addEventListener('click', openAuthForm);
logoutBtn.addEventListener('click', logOut);
form.addEventListener('submit', addTask);
selectAllButton.addEventListener('click', selectAll);
allButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
activeButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
completedButton.addEventListener('click', () => {Viewer.showTasks(allButton, activeButton, completedButton, ul, store);});
clearCompletedButton.addEventListener('click', clearCompleted);
ul.addEventListener('click', selectTaskClick);
ul.addEventListener('click', deleteTaskClick);


async function initStore(){
    store.clear();
    const storeData = await TaskModule.get(token);
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
    const response = await TaskModule.post(token, fakeTask);
    const id = response.name;

    const trueTask = new Task(id, this.description.value, false);
    await TaskModule.update(token, id, trueTask);
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
            TaskModule.delete(token, li.id);
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
        TaskModule.update(token, target.id, store.get(target.id));
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
        TaskModule.delete(token, li.id);
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
                TaskModule.update(token, li.id, store.get(li.id));
                checkbox.checked = true;
            }
        }
    });
    Viewer.showTasks(allButton, activeButton, completedButton, ul, store);
    Viewer.updateCounter(counterLabel, store);
}

async function logIn(){
    const inputField = document.getElementById('username');
    const userName = inputField.value;
    if(userName === ''){
        return;
    }

    const usersStore = await UserModule.get();

    let isRegistered = false;
    usersStore.forEach(user => {
        if(isRegistered !== true && user.name === userName){
            isRegistered = true;
            token = user.id;
        }
    })

    if(isRegistered === false){
        const fakeUser = new User('', userName);
        const response = await UserModule.post(fakeUser);

        const id = response.name;
        token = id;
        const trueUser = new User(id, userName);
        await UserModule.update(trueUser.id, trueUser);
    }

    await initStore();

    inputField.value = '';
    Viewer.changeAuthStatus('modal_button', 'logout_button', userName);
    modal.modalWindow.hide();

}

async function logOut(){
    token = GENERAL_STORAGE;
    Viewer.changeAuthStatus('logout_button', 'modal_button', 'Common');
    await initStore();
}

function openAuthForm(){
    const submitBtn = document.querySelector(`.${modal.btnName}`);

    modal.modalWindow.show();
    submitBtn.addEventListener('click', logIn);
}


