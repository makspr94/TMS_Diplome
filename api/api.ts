import axios from "axios";

const baseURL = "https://jsonplaceholder.typicode.com"

export async function get(path: string) {
    return (await axios.get(baseURL + path)
    .catch(function (error){
        return error.toJSON();
    }));
}

export async function post(path: string, body) {

    return (await axios.post(baseURL + path, body)
    .catch(function (error){
        return error.toJSON();
    }));
}

export async function patch(path: string, body) {
    return (await axios.patch(baseURL+path, body)
    .catch(function(error){
        return error.toJSON();
        }));
}

export async function del(path:string) {
    return (await axios.delete(baseURL+path)
    .catch(function(error){
        return error.toJSON();
    }));
    
}