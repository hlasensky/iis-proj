"use client";
import { cartAtom } from "@/app/userAtom";
import { Conference } from "@prisma/client";
import { useAtomValue } from "jotai";
import React from "react";

function CartNumbers({ conferences }: { conferences: Conference[] }) {
    const cart = useAtomValue(cartAtom);
    return (
        <>
            <p>
                Number of tickets:{" "}
                {cart.reduce((acc, item) => acc + item.numberOfTickets, 0)}
            </p>
            <p className="text-lg font-bold mb-8">
                Price:{" "}
                {cart.reduce(
                    (
                        acc: number,
                        item: {
                            id: string;
                            name: string;
                            numberOfTickets: number;
                        },
                    ) =>
                        acc +
                        item.numberOfTickets *
                            (conferences.find((conf) => conf.id === item.id)
                                ?.price || 0),
                    0,
                )}{" "}
                Kč
            </p>
        </>
    );
}

export default CartNumbers;
