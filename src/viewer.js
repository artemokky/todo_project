
export class Viewer{

    static showTasks(allButton, activeButton, completedButton, ul, store) {
        ul.innerHTML = '';

        store.forEach((value) =>{
            if (allButton.checked) {
                ul.appendChild(value.html);
            } else if (activeButton.checked && value.status === false) {
                ul.appendChild(value.html);
            } else if (completedButton.checked && value.status === true) {
                ul.appendChild(value.html);
            }
        });
    }

    static updateCounter(counterLabel, store) {
        let counter = 0;
        store.forEach(task => {
            if (task.status === false) {
                counter++;
            }
        })
        counterLabel.textContent = counter.toString() + ' items left';
    }
}