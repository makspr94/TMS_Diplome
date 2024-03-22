import { titleForNewAlbum } from "../../data/albums/albumTestData";
import {get, post, patch, del} from  "../api";

class Albums{

    private path: string = '/albums';
    private queryByUserId = "?userId=";

    async getAll(){
        return await get(this.path); 
    }

    async getAlbumsById (albumId: number){
        return await get(`${this.path}/${albumId}`);
    }

    async getAllAlbumsByUserId(userId: number) {
        return await get(this.path + this.queryByUserId + userId);
    }

    async getRandomAlbumId() {
        let allAlbumsIdArray: number[] = this.getAllUniqueValuesByKey('id', await this.getAll());
        let randomAlbumId: number = Math.floor(Math.random()*allAlbumsIdArray.length);
        return randomAlbumId;
    };

    async getRandomUserId() {
        let allUsersIdArray: number[] = this.getAllUniqueValuesByKey('userId', await this.getAll());
        let randomUserId: number = Math.floor(Math.random() * allUsersIdArray.length);
        if (randomUserId == 0){
            randomUserId = 1;
        }
        return randomUserId;
    };

    async getNonExistentAlbumId(){
        return (await this.getAll()).data.length + 1; 
    }

    getAllUniqueValuesByKey(key: string, response){
        const responseData = response.data; 
        let allUniqueValues = new Set<number>();
        for (let obj of responseData){
            allUniqueValues.add(obj[key]);
        }
        let allPostsIdArray = Array.from(allUniqueValues);
        return allPostsIdArray;
    };
    
    async createNewAlbumByUser(userId: number){
        let newAlbum = titleForNewAlbum;
        newAlbum.userId = userId;
        return await post(this.path, newAlbum);
    };



}

export const albums = new Albums();