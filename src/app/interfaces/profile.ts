import { Service } from './service';
import { Address } from './address';

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

export interface Category {
    id: number;
    service: Service;
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
    categories: Category[];
    reviews: Review[];
    gallery: Gallery[];
}