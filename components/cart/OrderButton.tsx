"use client";

import { getSessionUser } from "@/actions/actions";
import { processOrder } from "@/actions/cartAction";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/userAtom";
import { Loader2 } from "lucide-react";

function OrderButton() {
    const [cart, setCart] = useAtom(cartAtom);
    const [loading, setLoading] = React.useState(false);
    return (
        <Button
            onClick={async () => {
                if (loading) return;
                setLoading(true);
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
                    toast.error("Order unsuccesful");
                else {
                    toast.success("Order succesful");
                    setCart([]);
                }
            }}
        >
            {loading ? <Loader2 className="animate-spin" /> : "Order"}
        </Button>
    );
}

export default OrderButton;
