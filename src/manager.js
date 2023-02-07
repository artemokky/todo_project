export class Manager{
    static post(task) {
        return fetch('https://todo-app-ac6eb-default-rtdb.firebaseio.com/storage.json', {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
    }

    static get(){
        return fetch('https://todo-app-ac6eb-default-rtdb.firebaseio.com/storage.json', {
            method: 'GET',
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
            .then(response =>{
                return response ? Object.keys(response).map( key => ({
                    ...response[key],
                    id: key,
                })) : []
            })
    }

    static delete(token){
        fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/storage/${token}.json`, {
            method: 'DELETE',
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
    }

    static update(id,task){
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/storage/${id}.json`, {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
    }
}