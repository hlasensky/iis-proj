import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

import { Cart } from "@/lib/types";

export const cartAtom = atomWithStorage<Cart>("cart", { tickets: [] });

export const activeNavAtom = atom(0);