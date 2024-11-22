import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

import CartList from "@/components/cart/CartList";
import { ConfKeyForm } from "@/components/conference/ConfKeyForm";
import CartNumbers from "@/components/cart/CartNumbers";
import OrderButton from "@/components/cart/OrderButton";
import { getConferences } from "@/actions/conferenceActions";
import { Conference } from "@prisma/client";

async function Page() {
    const conferences = (await getConferences()) as Conference[];
    return (
        <Card className="w-3/4 mx-auto my-6">
            <CardHeader className="text-3xl font-semibold">
                <h1>Cart</h1>
            </CardHeader>
            <CardContent>
                <hr className="my-4"></hr>
                <CartList />
            </CardContent>
            <CardFooter className="grid">
                <CartNumbers conferences={conferences} />
                <OrderButton />

                <hr className="my-4"></hr>
                <ConfKeyForm />
            </CardFooter>
        </Card>
    );
}

export default Page;
