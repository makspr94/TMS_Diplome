import { albums } from "../api/endpoints/albums";
import { photos } from "../api/endpoints/photos";
import { isPhoto } from "../data/photos/photosModel";
import { photoForCreationAlbum5, photoForCreationWithoutAlbumId } from "../data/photos/photosTestData";

describe ('photos tests', () => {

    //   - Пользователь может получить все фото в альбоме по его Id
    test ("get all photos by UserId", async () => {
        const randomAlbumId: number = await photos.getRandomAlbumId()
        const response = await photos.getAllPhotosByAlbumId(randomAlbumId); //TODO #1
        expect(response.status).toEqual(200);
        response.data.forEach(photo => {
            expect(isPhoto(photo)).toBeTruthy();
            expect(photo.albumId).toEqual(randomAlbumId);
            
        });
    });

    //   - Пользователь может получить конкретное фото по его Id
    test ("get photo by Id", async () =>{
        const randomPhotoId: number = await photos.getRandomPhotoId();
        const response = await photos.getPhotoById(randomPhotoId);
        expect(response.status).toEqual(200);
        expect(isPhoto(response.data)).toBeTruthy();
        expect(response.data.id).toEqual(randomPhotoId); 

    })

    //   - Пользователь может загрузить новое фото
    test ("user uploads new photo", async () =>{
        const existingPhotos = photos.getAllUniqueValuesByKey("id", await photos.getAll());
        const response = await photos.createNewPhoto(photoForCreationAlbum5);
        expect(response.status).toEqual(201);
        expect(existingPhotos).not.toContain(response.data.id);
        expect (response.data.albumId).toEqual(photoForCreationAlbum5.albumId);
        expect(isPhoto(response.data)).toBeTruthy();
    });

    //   - Пользователь не может загрузить новое фото, не указав albumI
    test ("NEGATIVE-404: user cannot upload new photo without albumId", async () =>{
        const response = await photos.createNewPhoto(photoForCreationWithoutAlbumId);
        expect(response.status).toEqual(404);
    })

    //   - Пользователь не может загрузить новое фото, указав Id несуществующего альбома.
    test ("NEGATIVE-404: user cannot create photo with non-existing album", async () => {
        const nonExistentAlbumId: number = await albums.getNonExistentAlbumId();
        let createPhotoForNonExistentAlbum = photoForCreationAlbum5;
        createPhotoForNonExistentAlbum.albumId = nonExistentAlbumId;
        const response = await photos.createNewPhoto(createPhotoForNonExistentAlbum);
        expect(response.status).toEqual(404);
        console.log(response.data);
    })

})