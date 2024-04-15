import { photoForCreationAlbum5 } from "../../data/photos/photosTestData";
import { get, post, patch, del } from "../api";

class Photos {
  private path = "/photos";
  private queryByAlbumId = "?albumId=";

  async getAll() {
    return await get(this.path);
  }

  async getPhotoById(photoId: number) {
    return await get(`${this.path}/${photoId}`);
  }

  async getAllPhotosByAlbumId(albumId: number) {
    return await get(this.path + this.queryByAlbumId + albumId);
  }

  async getRandomPhotoId() {
    let allPhotosIdArray: number[] = this.getAllUniqueValuesByKey(
      "id",
      await this.getAll(),
    );
    let randomPhotoId: number = Math.floor(
      Math.random() * allPhotosIdArray.length,
    );
    return randomPhotoId;
  }

  async getRandomAlbumId() {
    let allAlbumsIdArray: number[] = this.getAllUniqueValuesByKey(
      "albumId",
      await this.getAll(),
    );
    let randomAlbumId: number = Math.floor(
      Math.random() * allAlbumsIdArray.length,
    );
    return randomAlbumId;
  }

  async createNewPhoto(requestBody: object) {
    return await post(this.path, requestBody);
  }

  getAllUniqueValuesByKey(key: string, response) {
    const responseData = response.data;
    let allUniqueValues = new Set<number>();
    for (let obj of responseData) {
      allUniqueValues.add(obj[key]);
    }
    let allPostsIdArray = Array.from(allUniqueValues);
    return allPostsIdArray;
  }
}

export const photos = new Photos();
