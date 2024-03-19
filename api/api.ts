import axios from "axios";

const baseURL = "https://jsonplaceholder.typicode.com/"

export async function get(path: string) {
    return (await axios.get(baseURL + path)
    .catch(function (error){
        return error.toJSON();
    }));
}