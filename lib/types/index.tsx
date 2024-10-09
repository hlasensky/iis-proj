
export type Ticket = {
    id: number,
    name: string,
    price: number,
    amount: number
}

export type Cart = {
    tickets: Ticket[]
}