import { Application, Assets, Sprite, Ticker } from "pixi.js";
import { Screen } from "../components/Screen";
import { Game } from "../main";
import gsap from "gsap";
import { ICardStack } from "../enums";

export class AceOfShadowsScreen extends Screen {
  private stackOne: ICardStack<Sprite> = { x: 100, y: 500, cards: [] };
  private stackTwo: ICardStack<Sprite> = { x: 300, y: 500, cards: [] };

  constructor(game: Game) {
    super(game);
  }

  public async init(): Promise<void> {
    super.init();
    console.log("Initializing Ace of Shadows", this.game);

    const cardTexture = await Assets.load({ alias: 'ace_of_diamonds', src: './../assets/ace/ace_of_diamonds.png' });
    this.createStackOfCards();

    setTimeout(() => {
      this.shuffleCards();
    }, 2000);
  }

  public update(time: Ticker): void {
    // Update logic for "Ace of Shadows"
  }

  public onResize(): void {
    console.log("Resizing Ace of Shadows Screen");

    // Update stack positions based on new screen dimensions
    this.updateStackPositions();
  }

  private updateStackPositions(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Update stackOne position
    this.stackOne.x = screenWidth * 0.25; // 25% from the left
    this.stackOne.y = screenHeight * 0.8; // 80% from the top

    // Update stackTwo position
    this.stackTwo.x = screenWidth * 0.75; // 75% from the left
    this.stackTwo.y = screenHeight * 0.8; // 80% from the top

    // Reposition cards in stackOne
    this.stackOne.cards.forEach((card, index) => {
      card.position.set(this.stackOne.x, this.stackOne.y - index * 2);
    });

    // Reposition cards in stackTwo
    this.stackTwo.cards.forEach((card, index) => {
      card.position.set(this.stackTwo.x, this.stackTwo.y - index * 2);
    });
  }

  private createStackOfCards(): void {
    for (let i = 0; i < 144; i++) {
      const card = new Sprite(Assets.get('ace_of_diamonds'));
      card.anchor.set(0.5);
      card.scale.set(0.1);
      card.zIndex = i;
      card.position.set(this.stackOne.x, this.stackOne.y - i * 2); // Stack cards with a slight offset
      this.stackOne.cards.push(card);

      this.addChild(card);
    }
  }

  private shuffleCards(): void {
    const shuffleNextCard = () => {
      const topCard = this.stackOne.cards.pop();
      if (!topCard || !this.stackTwo) return;

      const targetStack = this.stackTwo;
      const targetY = targetStack.y - targetStack.cards.length * 2;

      console.log("Shuffling card", targetY);

      let tl = gsap.timeline();

      // Add animations to timeline
      tl.to(topCard, {
        x: targetStack.x,
        y: targetY,
        rotation: Math.PI * 2, // Full 360-degree rotation
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          // Update z-index halfway through the animation
          if (tl.progress() > 0.5) {
            topCard.zIndex = targetStack.cards.length;
          }
        },
        onComplete: () => {
          // Reset rotation to 0
          topCard.rotation = 0;
          // Add card to target stack
          targetStack.cards.push(topCard);

          // Continue shuffling if there are more cards
          if (this.stackOne.cards.length > 0) {
            // Add small delay between card movements
            setTimeout(shuffleNextCard, 0);
          } else {
            console.log("Shuffling complete!");
          }
        }
      });
    };

    // Start the shuffle animation
    shuffleNextCard();
  }
}