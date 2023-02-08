export class TaskModule{
    static post(token, task) {
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/${token}.json`, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
    }

    static get(token){
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/${token}.json`, {
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

    static delete(token, id){
        fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/${token}/${id}.json`, {
            method: 'DELETE',
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
    }

    static update(token, id,task){
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/${token}/${id}.json`, {
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

export class UserModule{
    static post(user) {
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/users.json`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
    }

    static get(){
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/users.json`, {
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

    static update(id,user){
        return fetch(`https://todo-app-ac6eb-default-rtdb.firebaseio.com/users/${id}.json`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {'content': 'app/json'}
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
    }
}