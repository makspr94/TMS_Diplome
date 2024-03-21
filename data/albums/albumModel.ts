export interface IAlbum{
    userId: number,
    id: number,
    title: string,
}
export function isAlbum (obj: any): obj is IAlbum{
    return "userId" in obj 
    && "id" in obj 
    && "title" in obj 
};

//input data for Post request for Albums endpoint
export interface ICreateAlbum{
    userId?: number,
    title?: string
}