import { getAllPosts, getPostById, getAllUsersId, getRandomUserId } from "../api/endpoints/posts"
import { IPostData, isPost } from "../data/post/postModel";


describe( "post tests", () => {

    // - Пользователь может получить все посты
    test('get all posts', async () => {
        const response = await getAllPosts();
        expect(response.status).toEqual(200);
        let responsePost = response.data[0];
        expect(isPost(responsePost)).toBeTruthy();
        console.log(response.data.length);  
    });

   // - Пользователь может получить пост по его Id
    test.only  ('get post by ID', async () => {
        const response = await getPostById(3); //TODO #1
        expect(response.status).toEqual(200);
        expect(isPost(response.data)).toBeTruthy();  
    });

    //- Пользователь должен получить ошибку 404 при попытке получить пост с несуществующим Id
    test ('NEGATIVE-404: get no-existent post', async () => {
        const noExistPostNum: number = (await getAllPosts()).data.length + 1;
        const response = await getPostById(noExistPostNum);
        expect(response.status).toEqual(404);
    });

    //- Пользователь может получить все посты для конкретного пользователя по userId
    test.only ('get all posts by userID', async () => {
        const randomUsedId = await getRandomUserId();
        const response = await getAllPostsByUserId(randomUsedId);
    })

})




/*- Для эндпоинта /posts:
 

  
  
  - Пользователь получит пустой массив при попытке получить посты для несуществующего юзера
  - Пользователь может получить все комментарии к посту по его Id
  - Пользователь получит пустой массив при попытке получить комментарии к несуществующему посту
  - Пользователь может создать новый пост
  - Пользователь может обновить заголовок (title) существующего поста
  - Пользователь может удалить пост по Id 
  
  
  
  TODO
  1. randomizer for post id
  2. randomizer for 'get all posts by userID' test. create utilite folder

  */
  
