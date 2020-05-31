import { Address } from './address';
import { Category } from './category';

export interface Review {
    id: number;
    from_profile: {id: number, name: string};
    note: number;
    text: string;
}

export interface Gallery {
    image: string;
}

export interface TypePay {
    id: number;
    name: string;
}

export interface ProfileCategory {
    id: number;
    category: Category;
    type_pay: TypePay;
    price: number;
}

export interface Profile {
    id: number;
    name: string;
    types: string;
    cpf: string;
    email: string;
    phone: string;
    address: Address;
    rating: string;
    photo: string;
    categories: ProfileCategory[];
    reviews: Review[];
    gallery: Gallery[];
}