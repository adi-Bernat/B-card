export interface LikeUser {
    _id?: string;
    id?: string;
}
export type Ncards = {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    phone: string;
    email?: string;
    web?: string;
    image: {
        url: string;
        alt?: string;
    };
    address: {
        state?: string;
        country: string;
        city: string;
        street?: string;
        houseNumber?: number | string;
        zip?: number | string;
    };
    likes?: (string | LikeUser)[];
    user_id?: string;
    createdAt?: string;
    [key: string]: unknown;
}

