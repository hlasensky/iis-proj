import { Presentation, Room } from "@prisma/client";

export type Ticket = {
    id: number;
    name: string;
    price: number;
    amount: number;
};

export type Cart = { id: string; name: string; numberOfTickets: number }[];

export type UserProgram = {
    presentations: (Presentation & { room: Room | null } & {
        creator: { name: string | null };
    })[];
} | null;
