import { Injectable } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { Address } from 'src/app/interfaces/address';
import { CreditCard } from 'src/app/interfaces/card';
import { Category } from 'src/app/interfaces/category';

export interface Card {
    card_token: string;
    card_number: number;
    card_name: string;
    card_month: number;
    card_year: number;
    card_cvv: number;
}

export interface Payment {
    method: 'credit_card' | 'ticket';
    card?: Card;
}

export interface Observation {
    text?: string;
    images?: {path: string; file: Blob[]}[];
}

@Injectable()
export class Global {
    category: Category;
    professional: Profile;
    address: Address;
    datetime: string;
    observation: Observation;

    payment: Payment;
    pagseguro: {cards: CreditCard};
}