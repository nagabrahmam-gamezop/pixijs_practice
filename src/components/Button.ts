import { Text, TextStyle, Container, Graphics } from "pixi.js";

export class Button extends Container {

  private text: Text;
  private background: Graphics;
  private buttonMode: boolean;

  constructor(label: string, onClick: () => void) {
    super();

    // Create text
    this.text = new Text(label, new TextStyle({ fill: 0xffffff, fontSize: 16 }));
    this.text.anchor.set(0.5);

    // Create background (optional)
    this.background = new Graphics();
    this.drawBackground();

    // Add children
    this.addChild(this.background, this.text);

    // Enable interactivity
    this.interactive = true;
    this.buttonMode = true;

    // Add click event
    this.on("pointerdown", onClick);

    // Add hover effects
    this.on("pointerover", () => this.onHover());
    this.on("pointerout", () => this.onHoverEnd());
  }

  private drawBackground(): void {
    const padding = 10;
    const width = this.text.width + padding * 2;
    const height = this.text.height + padding * 2;

    this.background.clear();
    this.background.beginFill(0x000000, 0.5); // Semi-transparent black background
    this.background.drawRoundedRect(-width / 2, -height / 2, width, height, 5);
    this.background.endFill();
  }

  private onHover(): void {
    this.text.style.fill = 0xffcc00; // Change text color on hover
  }

  private onHoverEnd(): void {
    this.text.style.fill = 0xffffff; // Reset text color
  }
}