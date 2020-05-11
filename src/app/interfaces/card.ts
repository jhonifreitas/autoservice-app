export interface Image {
    size: string;
    path: 'SMALL' | 'MEDIUM';
}

export interface Card {
    code: number;
    name: string;
    displayName: string;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    images: {MEDIUM: Image, SMALL: Image}
}

export interface CreditCard {
    AMEX: Card;
    AURA: Card;
    BRASILCARD: Card;
    CABAL: Card;
    CARDBAN: Card;
    DINERS: Card;
    ELO: Card;
    FORTBRASIL: Card;
    GRANDCARD: Card;
    HIPERCARD: Card;
    MAIS: Card;
    MASTERCARD: Card;
    PERSONALCARD: Card;
    PLENOCARD: Card;
    SOROCRED: Card;
    VALECARD: Card;
    VISA: Card;
}