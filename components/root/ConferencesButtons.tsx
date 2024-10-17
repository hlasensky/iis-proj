"use client";

import React from "react";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/userAtom";
import { Minus, Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";

function ConferencesButtons({
	id,
	name,
	capacity,
}: {
	id: string;
	name: string;
	capacity: number;
}) {
	const [cart, setCart] = useAtom(cartAtom);
	const itemInCart = cart.find((item) => item.id === id);
	return (
		<div className="flex gap-2 flex-wrap">
			<Button variant={"outline"}>Detail</Button>
			{itemInCart ? (
				<div className="flex items-center gap-2">
					{itemInCart.numberOfTickets > 1 ? (
						<Button
							onClick={() => {
								setCart((prev) =>
									prev.map((item) =>
										item.id === id
											? { ...item, numberOfTickets: item.numberOfTickets - 1 }
											: item
									)
								);
							}}
						>
							<Minus />
						</Button>
					) : (
						<Button
							onClick={() => {
								setCart((prev) => prev.filter((item) => item.id !== id));
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
					<Button
						onClick={() => {
							setCart((prev) =>
								prev.map((item) =>
									item.id === id && item.numberOfTickets < capacity
										? { ...item, numberOfTickets: item.numberOfTickets + 1 }
										: item
								)
							);
						}}
					>
						<Plus />
					</Button>
				</div>
			) : (
				<Button
					onClick={() => {
						setCart((prev) => [...prev, { id, name, numberOfTickets: 1, capacity }]);
					}}
				>
					Add to cart
				</Button>
			)}
		</div>
	);
}

export default ConferencesButtons;
