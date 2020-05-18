import { Injectable } from '@angular/core';
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

@Injectable()
export class Global {
    payment: Payment;
    pagseguro: {cards: CreditCard}
}