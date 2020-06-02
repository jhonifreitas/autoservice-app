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

@Injectable()
export class Global {
    category: Category;
    professional: Profile;
    address: Address;
    date: string;
    time: string;
    observation?: string;
    images?: {path: string; file: Blob}[] = [];

    payment: Payment;
    pagseguro: {cards: CreditCard};
}