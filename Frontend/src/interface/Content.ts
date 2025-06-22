interface Content {
    type: "twitter" | "youtube" | "document" | "image" | "link";
    title: string;
    link?: string;
    content?: string;
    tags?: string[];
    _id: string;
    createdAt?: Date;
    userId:{
        _id:string,
        username:string
    }
}
export type { Content };