import { atomWithStorage } from "jotai/utils";

import { Cart } from "@/lib/types";
import { Presentation } from "@prisma/client";
import { atom } from "jotai";

export const cartAtom = atomWithStorage<Cart>("cart", []);

export const openPopupAtom = atom<boolean>(false);

export const selectedPresentationAtom = atom<Presentation | null>(null);
