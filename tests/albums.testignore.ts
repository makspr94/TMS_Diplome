import { albums } from "../api/endpoints/albums";
import { isAlbum } from "../data/albums/albumModel";

//TODO проверить где используется слово POST и переименовать

describe ("albums tests", () => {
    //- Пользователь может получить все альбомы
    test ('get all albums', async () =>{
        const response =  await albums.getAll();
        expect(response.status).toEqual(200);
        let responsePost = response.data[0];
        expect(isAlbum(responsePost)).toBeTruthy();
    })

    
    //- Пользователь может получить альбом по его Id
    test ('get post by ID', async () => {
        const randomAlbumId: number = await albums.getRandomAlbumId()
        const response = await albums.getAlbumsById(randomAlbumId); //TODO #1
        expect(response.status).toEqual(200);
        expect(isAlbum(response.data)).toBeTruthy();
        expect(response.data.id).toEqual(randomAlbumId); 
    });




    // - Пользователь может получить все альбомы конкретного пользователя по userId
    test ('get all Album by userID', async () => {
        const randomUsedId = await albums.getRandomUserId();
        const response = await albums.getAllAlbumsByUserId(randomUsedId);
        expect(response.status).toEqual(200);
        expect(+(albums.getAllUniqueValuesByKey('userId', response))).toEqual(randomUsedId); 
    });



    //- Пользователь может добавить новый альбом
    test ('User creates new album ', async () => {
        const randomUserId: number = await albums.getRandomUserId();
        const nonExistentPostId: number = await albums.getNonExistentPostId();
        const response = await albums.createNewAlbumByUser(randomUserId);
        expect(response.status).toEqual(201);
        expect(isAlbum(response.data)).toBeTruthy();
        expect(nonExistentPostId).toEqual(response.data.id);
    })

});



