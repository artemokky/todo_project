export class Task{
    id;
    description;
    status;
    html;

    constructor(id, description, status) {
        this.id = id
        this.status = status;
        this.html = createLi({id, description, status});
        this.description = description;
    }

    get description() {
        return this.description;
    }

    set description(value) {
        this.description = value;
    }

    get id() {
        return this.id;
    }

    set id(id) {
        this.id = id;
    }

    get status() {
        return this.status;
    }

    set status(value) {
        this.status = value;
    }

    get html() {
        return this.html;
    }
}

/**
 *
 * @param task {{id : string, description : string, status : boolean}}
 * @return {HTMLElement}
 */
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

    span.textContent = task.description;

    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.className = 'delete_btn';
    deleteButton.title = 'Удалить задачу';

    if(task.status === true) {
        span.className += ' done';
        input.checked = true;
    }

    div.append(input, label, span, deleteButton);


    li.append(div);

    return li;
}