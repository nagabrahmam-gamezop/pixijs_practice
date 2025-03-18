import { Application, Container, Ticker, warn } from "pixi.js";
import { Game } from "../main";

export interface IScreen {
  init(): void;
  update(time: Ticker): void;
  onResize(): void;
}

export class Screen extends Container implements IScreen {

  protected game : Game | null = null;

  constructor(game: Application) {
    super();
    this.game = game as Game;
  }

  public init(): void {
    
  }

  public update(time: Ticker): void {

  }

  public onResize(): void {

  }

}