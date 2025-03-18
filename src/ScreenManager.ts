import { Container, Ticker } from "pixi.js";
import { ScreenNames } from "./enums";
import { Screen } from "./components/Screen";

export class ScreenManager {
    
  private currentScreen: Screen | null = null;
  private screens: { [key in ScreenNames]?: Screen } = {};

  constructor(private stage: Container) {}

  public registerScreen(name: ScreenNames, screen: Screen): void {
    this.screens[name] = screen;
  }

  public switchScreen(name: ScreenNames): void {
    if (this.currentScreen) {
      this.stage.removeChild(this.currentScreen);
    }

    this.currentScreen = this.screens[name] || null;
    if (this.currentScreen) {
      this.stage.addChild(this.currentScreen);
      this.currentScreen.init();
    }
  }

  public update(time: Ticker): void {
    if (this.currentScreen) {
      this.currentScreen.update(time);
    }
  }

  public onResize(): void {
    if (this.currentScreen) {
      this.currentScreen.onResize();
    }
  }
}