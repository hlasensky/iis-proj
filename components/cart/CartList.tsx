"use client";

import React from "react";
import ConferencesButtons from "../root/ConferencesButtons";
import { cartAtom } from "@/app/userAtom";
import { useAtomValue } from "jotai";

function CartList() {
    const cart = useAtomValue(cartAtom);

    return cart.length === 0 ? (
        <p>Košík je prázdný</p>
    ) : (
        <ul>
            {cart.map(async (item, i) => {
                return (
                    <li key={i} className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <ConferencesButtons
                            id={item.id}
                            name={item.name}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default CartList;
