import { City } from './city';
import { Profile } from './profile';
import { Service } from './service';

export interface Review {
    id: number;
    from_profile: Profile;
    note: number;
    text: string;
}

export interface AutonomousService {
    id: number;
    service: Service;
    week: number[];
    start_hour: string;
    end_hour: string;
    type_pay: string;
    price: number;
}

export interface Autonomous {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: City;
    birthday: string;
    rating: string;
    photo: string;
    about: string;
    services: AutonomousService[];
    reviews: Review[];
}
