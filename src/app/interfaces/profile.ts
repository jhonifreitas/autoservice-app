import { City } from './city';
import { Service } from './service';

export interface Review {
    id: number;
    from_profile: {id: number, name: string};
    note: number;
    text: string;
}

export interface JobDone {
    id: number;
    image: string;
    service: Service;
}

export interface TypePay {
    id: number;
    name: string;
}

export interface ProfileService {
    id: number;
    service: Service;
    week: number[];
    start_hour: string;
    end_hour: string;
    type_pay: TypePay;
    price: number;
}

export interface Profile {
    id: number;
    name: string;
    types: string;
    email: string;
    phone: string;
    city: City;
    birthday: string;
    rating: string;
    photo: string;
    about: string;
    services: ProfileService[];
    reviews: Review[];
    jobs_done: JobDone[];
}