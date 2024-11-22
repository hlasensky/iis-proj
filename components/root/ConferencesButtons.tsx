"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/userAtom";
import { Loader2, Minus, Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";
import { getCapacity } from "@/actions/conferenceActions";

function ConferencesButtons({ id, name }: { id: string; name: string }) {
    const [cart, setCart] = useAtom(cartAtom);
    const [freeCapacity, setFreeCapacity] = useState<number | null>(null);
    const itemInCart = cart.find((item) => item.id === id);

    useEffect(() => {
        const fetchFreeCapacity = async () => {
            const capacity = await getCapacity(id);
            setFreeCapacity(capacity ? capacity?.freeNmOfTickets : null);
        };
        fetchFreeCapacity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex gap-2 flex-wrap">
            <Link title={name} href={`/conferences/${id}`}>
                <Button variant={"outline"}>Detail</Button>
            </Link>
            {itemInCart ? (
                <div className="flex items-center gap-2">
                    {itemInCart.numberOfTickets > 1 ? (
                        <Button
                            onClick={() => {
                                setCart((prev) =>
                                    prev.map((item) =>
                                        item.id === id
                                            ? {
                                                  ...item,
                                                  numberOfTickets:
                                                      item.numberOfTickets - 1,
                                              }
                                            : item,
                                    ),
                                );
                            }}
                        >
                            <Minus />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                setCart((prev) =>
                                    prev.filter((item) => item.id !== id),
                                );
                            }}
                        >
                            <Trash />
                        </Button>
                    )}
                    <Input
                        type="number"
                        value={itemInCart.numberOfTickets || 1}
                        readOnly
                        className=" text-center"
                    />
                    {freeCapacity ? (
                        <Button
                            onClick={() => {
                                setCart((prev) =>
                                    prev.map((item) =>
                                        item.id === id &&
                                        item.numberOfTickets < freeCapacity
                                            ? {
                                                  ...item,
                                                  numberOfTickets:
                                                      item.numberOfTickets + 1,
                                              }
                                            : item,
                                    ),
                                );
                            }}
                        >
                            <Plus />
                        </Button>
                    ) : (
                        <Button>
                            <Loader2 className="animate-spin" />{" "}
                        </Button>
                    )}
                </div>
            ) : (
                <Button
                    onClick={() => {
                        setCart((prev) => [
                            ...prev,
                            { id, name, numberOfTickets: 1 },
                        ]);
                    }}
                >
                    Add to cart
                </Button>
            )}
        </div>
    );
}

export default ConferencesButtons;
