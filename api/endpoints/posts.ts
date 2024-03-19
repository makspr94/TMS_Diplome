
import { get } from "../api";

const path = "/posts";



export async function getAllPosts() {
    return await get(path);
}

export async function getPostById (postId: number){
    return await get(`${path}/${postId}`);
}

getAllPostsByUserId

export async function getAllUsersId() {
    const response = await getAllPosts();
    const responseData = response.data; 
    let allUsersId = new Set<number>();
    for (let obj of responseData){
        allUsersId.add(obj.userId);
    }
    let allUsersIdArray = Array.from(allUsersId);
    //console.log(allUsersIdArray);
    return allUsersIdArray; 
}

export async function getRandomUserId() {
    let allUsersIdArray: number[] = await getAllUsersId();
    let randomUserId: number = Math.floor(Math.random() * allUsersIdArray.length);
    return randomUserId; 
}