import { CreateGameInterface } from "../api/firestore";
export type gameType = "DOBUTSU" | "GOROGORO" | "SHOGI" | null;
export type statusType = "WAITING" | "VICTORY" | "CANCELLED" | "RESIGNED" | null;

export class Game {
  #name: string | null;
  #type: gameType;
  #creator: string | null;
  #oponent: string | undefined;
  #startingPlayer: string | undefined;
  #createdOn: number = Date.now();
  #finishedOn: number | undefined;
  #timeToComplete: number | undefined;
  #winner: string | undefined;
  #status: statusType = "WAITING";

  constructor({ name, creator, type }: { name: string; creator: string; type: gameType }) {
    this.#name = name;
    this.#creator = creator;
    this.#type = type;
  }

  setOponentName(value: string) {
    this.#oponent = value;
  }

  getName() {
    return this.#name;
  }
}
