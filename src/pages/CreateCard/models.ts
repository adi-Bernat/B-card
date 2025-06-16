export interface Address {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
}

export interface Image {
    url: string;
    alt: string;
}

export interface FormData {
    title: string;
    phone: string;
    address: Address;
    image: Image;
    isBusiness: boolean;
}

export interface Card extends FormData {
    _id: string;
}
