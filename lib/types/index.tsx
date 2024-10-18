export type Ticket = {
	id: number;
	name: string;
	price: number;
	amount: number;
};

export type Cart = { id: string; name: string; numberOfTickets: number, freeCapacity: number }[];
