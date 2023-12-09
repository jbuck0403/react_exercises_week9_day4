import { X_RapidAPI_Key } from "../apiKey";

interface Mechanics {
  name?: string;
}

interface Card {
  artist?: string;
  attack?: number;
  cardId?: string;
  cardSet?: string;
  collectible?: true;
  cost?: number;
  dbfId?: number;
  elite?: true;
  flavor?: string;
  health?: number;
  img?: string;
  locale?: string;
  mechanics?: Mechanics[];
  name: string;
  playerClass?: string;
  rarity?: string;
  text?: string;
  type?: string;
  multiClassGroup?: string;
  spellSchool?: string;
}

class GetCard {
  extractImgs(data: Card[]): string[] {
    const conditions = (card: Card) => {
      return (
        card.img &&
        card.type != "Hero" &&
        card.type != "Hero Power" &&
        !card.text?.includes("dummy card") &&
        card.cardSet != "Battlegrounds" &&
        card.cardSet != "Mercenaries" &&
        card.cardSet != "Hero Skins"
      );
    };
    if (data.length > 0) {
      let foundImgs: any = {};
      data.forEach((card) => {
        if (conditions(card)) {
          if (!(card.name in foundImgs)) {
            if (card.name == "Arfus") console.log(card);
            foundImgs[`${card.name}`] = card.img;
          }
        }
      });
      return Object.values(foundImgs);
    } else return [];
  }

  async allCardsByClass(cardClass: string) {
    const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/classes/${cardClass}`;
    const data = await this.getData(url);
    console.log(data);
    return this.extractImgs(data);
  }

  async card(cardName: string) {
    const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/${cardName}`;
    const data = await this.getData(url);

    return this.extractImgs(data);
  }

  async allCards() {
    const url = "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards";
    const data = await this.getData(url);

    return this.extractImgs(data);
  }

  async cardSearch(cardToSearch: string) {
    const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/${cardToSearch}`;
    const data = await this.getData(url);

    return this.extractImgs(data);
  }

  async info() {
    const url = "https://omgvamp-hearthstone-v1.p.rapidapi.com/info";

    return await this.getData(url);
  }

  async classes() {
    const data = await this.info();
    const classes: string[] = data.classes;

    return classes.filter((className) => {
      return className != "Dream" && className != "Whizbang";
    });
  }

  async getData(url: string) {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": X_RapidAPI_Key,
        "X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      return await result;
    } catch (error) {
      console.error(error);
    }
  }
}

export default GetCard;
