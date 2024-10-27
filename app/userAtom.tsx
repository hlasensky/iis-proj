import { atomWithStorage } from "jotai/utils";

import { Cart } from "@/lib/types";
import { Presentation } from "@prisma/client";
import { atom } from "jotai";

export const cartAtom = atomWithStorage<Cart>("cart", []);

export const selectedPresentationAtom = atom<Presentation | null>(null);
