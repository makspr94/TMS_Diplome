import { photos } from "../api/endpoints/photos";
import { isPhoto } from "../data/photos/photosModel";

describe ('photos tests', () => {

    //   - Пользователь может получить все фото в альбоме по его Id
    test.only ("get all photos by UserId", async () => {
        const randomAlbumId: number = await photos.getRandomAlbumId()
        const response = await photos.getAllPhotosByAlbumId(randomAlbumId); //TODO #1
        expect(response.status).toEqual(200);
        response.data.forEach(photo => {
            expect(isPhoto(photo)).toBeTruthy();
            expect(photo.albumId).toEqual(randomAlbumId);
            
        });
    });

    //   - Пользователь может получить конкретное фото по его Id
    test.only ("get photo by Id", async () =>{
        const randomPhotoId: number = await photos.getRandomPhotoId();
        const response = await photos.getPhotoById(randomPhotoId);
        expect(response.status).toEqual(200);
        expect(isPhoto(response.data)).toBeTruthy();
        expect(response.data.id).toEqual(randomPhotoId); 

    })

//   - Пользователь может загрузить новое фото
    test.only ("user creates new photo", async () =>{
        const randomPhotoId: number = await photos.getRandomPhotoId();
        const response = await photos.getPhotoById(randomPhotoId);
//   - Пользователь не может загрузить новое фото, не указав albumId
//   - Пользователь не может загрузить новое фото, указав Id несуществующего альбома.

})


