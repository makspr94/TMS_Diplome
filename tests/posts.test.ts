import { IPostData, isPost } from "../data/posts/postModel";
import { posts } from "../api/endpoints/posts";
import { titleForUpdate } from "../data/posts/postTestData";

describe("posts tests", () => {
  // - Пользователь может получить все посты
  test("get all posts", async () => {
    const response = await posts.getAll();
    expect(response.status).toEqual(200);
    let responsePost = response.data[0];
    expect(isPost(responsePost)).toBeTruthy();
  });

  // - Пользователь может получить пост по его Id
  test("get post by ID", async () => {
    const randomPostId: number = await posts.getRandomPostId();
    const response = await posts.getPostById(randomPostId); //TODO #1
    expect(response.status).toEqual(200);
    expect(isPost(response.data)).toBeTruthy();
    expect(response.data.id).toEqual(randomPostId);
  });

  //- Пользователь должен получить ошибку 404 при попытке получить пост с несуществующим Id
  test("NEGATIVE-404: get non-existent post", async () => {
    const nonExistPostNum: number = await posts.getNonExistentPostId();
    const response = await posts.getPostById(nonExistPostNum);
    expect(response.status).toEqual(404);
  });

  //- Пользователь может получить все посты для конкретного пользователя по userId
  test("get all posts by userID", async () => {
    const randomUsedId = await posts.getRandomUserId();
    const response = await posts.getAllPostsByUserId(randomUsedId);
    expect(response.status).toEqual(200);
    //console.log('UserId of recieved posts', +(posts.getAllUsersId(response)));
    //console.log(randomUsedId);
    expect(+posts.getAllUniqueValuesByKey("userId", response)).toEqual(
      randomUsedId,
    );
  });

  //- Пользователь получит пустой массив при попытке получить посты для несуществующего юзера
  test("NEGATIVE-200: get posts by non-existent userId", async () => {
    const nonExistentUser: number = await posts.getNonExistentUser();
    const response = await posts.getAllPostsByUserId(nonExistentUser);
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject([]);
  });

  //- Пользователь может получить все комментарии к посту по его Id
  test("get all comments by Post Id", async () => {
    const randomPostId: number = await posts.getRandomPostId();
    const response = await posts.getAllCommentsByPostId(randomPostId);
    const postIdOfRecievedComments: number = +posts.getAllUniqueValuesByKey(
      "postId",
      response,
    );
    expect(response.status).toEqual(200);
    expect(postIdOfRecievedComments).toEqual(randomPostId);
    expect(response.data.length).toEqual(
      await posts.countCommentsWithSpecificPostId(randomPostId),
    );
  });

  // Пользователь получит пустой массив при попытке получить комментарии к несуществующему посту
  test("NEGATIVE-200: get comments by non-existent post Id", async () => {
    const nonExistentPostId: number = await posts.getNonExistentPostId();
    const response = await posts.getAllCommentsByPostId(nonExistentPostId);
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject([]);
  });

  //- Пользователь может создать новый пост
  test("User creates new post ", async () => {
    const randomUserId: number = await posts.getRandomUserId();
    const nonExistentPostId: number = await posts.getNonExistentPostId();
    const response = await posts.createNewPostByUser(randomUserId);
    expect(response.status).toEqual(201);
    expect(isPost(response.data)).toBeTruthy();
    expect(nonExistentPostId).toEqual(response.data.id);
  });

  //Пользователь может обновить заголовок (title) существующего поста
  test("update existing post", async () => {
    const randomPostId: number = await posts.getRandomPostId();
    const response = await posts.updateExistingPost(randomPostId);
    expect(response.status).toEqual(200);
    expect(response.data.id).toEqual(randomPostId);
    expect(response.data.title).toEqual(titleForUpdate.title);
  });

  //- Пользователь может удалить пост по Id
  test("delete post by Id", async () => {
    const randomPostId: number = await posts.getRandomPostId();
    const response = await posts.deletePostById(randomPostId);
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({});
  });
});

