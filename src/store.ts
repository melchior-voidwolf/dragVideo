import { create } from "zustand";

import z1 from "./assets/z1.png";
import z2 from "./assets/z2.png";
import z3 from "./assets/z3.png";

export type assetT = {
  name: string;
  id: string;
  cover: string;
  length: number;
};

export type channelT = {
  id: string;
  clipList: clipT[];
};

export type clipT = {
  id: string;
  name: string;
  assetId: string;
  startTime: number;
  endTime: number;
  showRange: [number, number];
};

export type storeT = {
  assetList: assetT[];
  channelList: channelT[];
};

const initStore: storeT = {
  assetList: [
    {
      name: "zustand1",
      id: "52d2a3d1-843b-4bec-9049-68f097bbe91e",
      cover: z1,
      length: 5,
    },
    {
      name: "zustand2",
      id: "52d2a3d1-843b-4bec-9049-68f097bbe91x",
      cover: z2,
      length: 5,
    },
    {
      name: "zustand3",
      id: "52d2a3d1-843b-4bec-9049-68f097bbe92e",
      cover: z3,
      length: 5,
    },
  ],
  channelList: [
    {
      id: "9a0375a2-d999-492d-84d4-76bf8c625378",
      clipList: [
        {
          id: "1415f666-3027-47f9-bb0a-74ede4eb1111",
          assetId: "52d2a3d1-843b-4bec-9049-68f097bbe91e",
          name: "zustand",
          startTime: 0,
          endTime: 5,
          showRange: [0, 5],
        },
        {
          id: "e0bd5c3d-f77d-4e6b-b51d-c6a312a41222",
          assetId: "52d2a3d1-843b-4bec-9049-68f097bbe91e",
          name: "zustand",
          startTime: 6,
          endTime: 11,
          showRange: [0, 5],
        },
      ],
    },
  ],
};

type modStateT = (state: storeT) => Partial<storeT>;
type modStoreT = (by: modStateT) => void;

export const useEdiorStore = create<storeT & { set: modStoreT }>()((set) => ({
  ...initStore,
  set: (by) => set((state) => by(state)),
}));
