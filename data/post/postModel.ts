export interface IPostData{
    userId: number,
    id: number,
    title: string,
    body: string
}
export function isPost (obj: any): obj is IPostData{
    return "userId" in obj 
    && "id" in obj 
    && "title" in obj 
    && "body" in obj
};


export interface ICommentData{
    userId: number,
    id: number,
    name: string,
    email: string,
    body: string
}
export function isComment (obj: any): obj is ICommentData{
    return "userId" in obj  
    && "id" in obj
    && "name" in obj
    && "email" in obj 
    && "body" in obj};