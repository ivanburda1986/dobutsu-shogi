type gameType = "DOBUTSU" | "GOROGORO" | "SHOGI" | undefined;
type statusType = "WAITING" | "VICTORY" | "CANCELLED" | "RESIGNED" | undefined;

export class Game {
  #name: string | undefined;
  #type: gameType;
  #creator: string | undefined;
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
