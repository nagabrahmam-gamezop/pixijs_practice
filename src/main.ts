import { Application, Assets, Sprite, Text, Ticker } from "pixi.js";
import { ScreenNames } from "./enums";
import { MenuScreen } from "./screens/MenuScreen";
import { AceOfShadowsScreen } from "./screens/AceOfShadowsScreen";
import { MagicWordsScreen } from "./screens/MagicWordsScreen";
import { PhoenixFlameScreen } from "./screens/PhoenixFlameScreen";
import { ScreenManager } from "./ScreenManager";


export class Game extends Application {
  private fpsText: Text | null = null;
  private screenManager: ScreenManager | null = null;

  constructor() {
    super();
    this.initialize();
  }

  async initialize() {

    await this.init({ background: '#1099bb', resizeTo: window });

    document.getElementById("pixi-container")?.appendChild(this.canvas);

    // Initialize ScreenManager
    this.screenManager = new ScreenManager(this.stage);

    // Register screens
    this.screenManager.registerScreen(ScreenNames.Menu, new MenuScreen(this, (taskName) => this.screenManager?.switchScreen(taskName)));
    this.screenManager.registerScreen(ScreenNames.AceOfShadows, new AceOfShadowsScreen(this));
    this.screenManager.registerScreen(ScreenNames.MagicWords, new MagicWordsScreen(this));
    this.screenManager.registerScreen(ScreenNames.PhoenixFlame, new PhoenixFlameScreen(this));

    // Load the initial screen (Menu)
    this.screenManager.switchScreen(ScreenNames.Menu);

    // Add FPS display
    this.addFPSDisplay();

    // Handle window resizing
    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize(); // Initial call to set the correct scale

    // Enable full-screen mode
    this.enableFullScreen();

    // Add update loop
    this.ticker.add((time) => this.update(time));
  }

  private update(time: Ticker) {
    // Delegate update to ScreenManager
    this.screenManager?.update(time);

    // Update FPS display
    if (this.fpsText) {
      this.fpsText.text = `FPS: ${Math.round(this.ticker.FPS)}`;
    }
  }

  private onResize() {
    // Delegate resize to ScreenManager
    this.screenManager?.onResize();
  }

  private enableFullScreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Failed to enable full-screen mode:', err);
      });
    } else {
      console.warn('Fullscreen API is not supported in this browser.');
    }
  }

  private addFPSDisplay() {
    this.fpsText = new Text('FPS: 0', { fill: 0xffffff, fontSize: 16, fontFamily: 'Arial' });
    this.fpsText.position.set(10, 10); // Top-left corner
    this.stage.addChild(this.fpsText);
  }
}

new Game();