import { Injectable } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { Address } from 'src/app/interfaces/address';
import { Service } from 'src/app/interfaces/service';
import { CreditCard } from 'src/app/interfaces/card';

export interface Card {
    card_token: string;
    card_number: number;
    card_name: string;
    card_birthdate: string;
    card_cpf: string;
    card_month: number;
    card_year: number;
    card_cvv: number;
}

export interface Payment {
    method: 'credit_card' | 'ticket';
    card?: Card;
}

export interface RequestService {
    service: Service;
    professional: Profile;
    address: Address;
    datetime: string;
    observation: {text: string; images: Blob[]}
}

@Injectable()
export class Global {
    request_service: RequestService;
    payment: Payment;
    pagseguro: {cards: CreditCard};
}