import { proxy, useSnapshot } from "valtio";

export const state = proxy({ razerKey: "" });

export const useState = () => useSnapshot(state);
