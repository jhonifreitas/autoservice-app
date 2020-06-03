import { City } from './city';
import { Profile } from './profile';
import { Category } from './category';

export interface Service {
    id?: number;
    category: Category;
    professional: Profile;

    lat: number;
    lng: number;
    zipcode: string;
    city: City;
    address: string;
    district: string;
    number: string;
    complement?: string;

    date: string;
    time: string;
    observation?: string;
    images?: {image: string}[];
    status: {text: string, value: 'done' | 'recused' | 'approved' | 'requested'};
}