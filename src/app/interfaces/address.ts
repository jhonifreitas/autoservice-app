import { City } from './city';

export interface Address {
    lat?: number;
    lng?: number;
    zipcode: string;
    address: string;
    number: string;
    district: string;
    city: City;
    complement?: string;
}
