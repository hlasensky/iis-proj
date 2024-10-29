"use client"

import { getSessionUser } from "@/actions/actions";
import { processOrder } from "@/actions/cartAction";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/userAtom";

function OrderButton() {
    const [cart, setCart] = useAtom(cartAtom);
    return (
        <Button
            onClick={async () => {
                const user = await getSessionUser();
                if (!user) {
                    signIn();
                    return;
                }

                const res = await processOrder(
                    cart.map((item) => ({
                        userId: user.id,
                        conferenceId: item.id,
                        numberOfTickets: item.numberOfTickets,
                    })),
                );
                if (res.some((item) => item.status === 500))
                    toast.error("Objednávka se nezdařila");
                else {
                    toast.success("Objednávka úspěšně odeslána");
                    setCart([]);
                }
            }}
        >
            Objednat
        </Button>
    );
}

export default OrderButton;
