"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cartAtom } from "@/app/userAtom";
import { useAtomValue } from "jotai";

function CartButton() {
	const cart = useAtomValue(cartAtom);
	return (
		<Link className="fixed top-8 right-5" href="/cart">
			<Button variant={"outline"} className="rounded-full w-16 h-16 relative">
				<ShoppingCart />
				<p className="absolute bottom-0 right-1 bg-slate-300 rounded-full h-[1.2rem] w-[1.2rem]">
					{cart.reduce((acc, item) => acc + item.numberOfTickets, 0)}
				</p>
			</Button>
		</Link>
	);
}

export default CartButton;
