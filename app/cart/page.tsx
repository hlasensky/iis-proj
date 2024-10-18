"use client";

import { useAtom } from "jotai";
import React from "react";
import { cartAtom } from "../userAtom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ConferencesButtons from "@/components/root/ConferencesButtons";
import { Button } from "@/components/ui/button";
import { processOrder } from "@/actions/cartAction";
import { toast } from "sonner";

function Page() {
	const [cart, setCart] = useAtom(cartAtom);

	return (
		<Card className="w-3/4 mx-auto my-6">
			<CardHeader className="text-3xl font-semibold">
				<h1>Košík</h1>
			</CardHeader>
			<CardContent>
				<hr className="my-4"></hr>
				{cart.length === 0 ? (
					<p>Košík je prázdný</p>
				) : (
					<ul>
						{cart.map((item, i) => (
							<li key={i} className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">{item.name}</h2>
								<ConferencesButtons
									id={item.id}
									name={item.name}
									freeCapacity={item.freeCapacity}
								/>
							</li>
						))}
					</ul>
				)}
			</CardContent>
			<CardFooter className="grid">
				<p>Celkem: {cart.reduce((acc, item) => acc + item.numberOfTickets, 0)}</p>
				<p>Cena: {cart.reduce((acc, item) => acc + item.numberOfTickets * 100, 0)} Kč</p>
				<Button
					onClick={async () => {
						const res = await processOrder(
							cart.map((item) => ({
								conferenceId: item.id,
								numberOfTickets: item.numberOfTickets,
							}))
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
			</CardFooter>
		</Card>
	);
}

export default Page;