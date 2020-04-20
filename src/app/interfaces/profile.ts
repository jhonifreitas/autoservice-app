import { City } from './city';

export interface Profile {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: City;
    photo: string;
}
