export interface IPhoto {
    albumId: number,
    id: number,
    title: string,
    url: string,
    thumbnailUrl: string
  };

  export function isPhoto(obj: any): obj is IPhoto{
    return "albumId" in obj 
    && "id" in obj 
    && "title" in obj 
    && "url" in obj 
    && "thumbnailUrl" in obj 
};

export interface IPhotoForCreation {
    albumId?: number,
    title?: string,
    url?: string,
    thumbnailUrl?: string
}