import { City } from './city';

export interface Address {
    zipcode: string;
    address: string;
    number: string;
    district: string;
    city: City;
    complement?: string;
}
