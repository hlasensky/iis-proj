import { atomWithStorage } from "jotai/utils";

import { Cart } from "@/lib/types";

export const cartAtom = atomWithStorage<Cart>("cart", { tickets: [] });

