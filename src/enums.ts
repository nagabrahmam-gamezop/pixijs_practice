export enum ScreenNames {
    Menu = "Menu",
    AceOfShadows = "AceOfShadows",
    MagicWords = "MagicWords",
    PhoenixFlame = "PhoenixFlame",
  }

  export interface ICardStack<T> {
    x: number;
    y: number;
    cards: T[];
  }