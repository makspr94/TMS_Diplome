import { get, post, patch, del } from "../api";
import { newPostExample, titleForUpdate } from "../../data/posts/postTestData";

class Posts {
  private path = "/posts";
  private queryByUserId = "?userId=";
  private queryByPostId = "?postId=";

  private pathComments = "/comments";

  getAllUniqueValuesByKey(key: string, response) {
    const responseData = response.data;
    let allUniqueValues = new Set<number>();
    for (let obj of responseData) {
      allUniqueValues.add(obj[key]);
    }
    let allPostsIdArray = Array.from(allUniqueValues);
    return allPostsIdArray;
  }

  //POSTS
  async getAll() {
    return await get(this.path);
  }

  async getPostById(postId: number) {
    return await get(`${this.path}/${postId}`);
  }

  async getNonExistentPostId() {
    return (await this.getAll()).data.length + 1;
  }

  async getAllPostsByUserId(userId: number) {
    return await get(this.path + this.queryByUserId + userId);
  }

  async getNonExistentUser() {
    const allUsers: number[] = this.getAllUniqueValuesByKey(
      "userId",
      await this.getAll(),
    );
    const nonExistentUser: number = allUsers[allUsers.length - 1] + 1;
    return nonExistentUser;
  }

  async getRandomUserId() {
    let allUsersIdArray: number[] = this.getAllUniqueValuesByKey(
      "userId",
      await this.getAll(),
    );
    let randomUserId: number = Math.floor(
      Math.random() * allUsersIdArray.length,
    );
    if (randomUserId == 0) {
      randomUserId = 1;
    }
    return randomUserId;
  }

  async getRandomPostId() {
    let allPostsIdArray: number[] = this.getAllUniqueValuesByKey(
      "id",
      await this.getAll(),
    );
    let randomPostId: number = Math.floor(
      Math.random() * allPostsIdArray.length,
    );
    return randomPostId;
  }

  async createNewPostByUser(userId: number) {
    let newPost = newPostExample;
    newPost.userId = userId;
    return await post(this.path, newPost);
  }

  async updateExistingPost(postId: number) {
    return await patch(`${this.path}/${postId}`, titleForUpdate);
  }

  async deletePostById(postId: number) {
    return await del(`${this.path}/${postId}`);
  }

  //COMMENTS
  async getAllCommentsByPostId(postId: number) {
    return await get(this.pathComments + this.queryByPostId + postId);
  }

  async getAllComments() {
    return await get(this.pathComments);
  }

  async countCommentsWithSpecificPostId(Postid: number): Promise<number> {
    const responseData = (await this.getAllComments()).data;
    let postsCounter: number = 0;
    for (let obj of responseData) {
      if (obj.postId == Postid) {
        postsCounter += 1;
      }
    }
    return postsCounter;
  }
}

export const posts = new Posts();
