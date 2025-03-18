import { Container, Ticker } from "pixi.js";
import { Button } from "../components/Button";
import { ScreenNames } from "../enums";
import { Screen } from "../components/Screen";
import { Game } from "../main";

export class MenuScreen extends Screen {
    private onTaskSelected: (taskName: ScreenNames) => void;
    private buttons: Button[] = [];

    constructor(game: Game, onTaskSelected: (taskName: ScreenNames) => void) {
        super(game);
        this.onTaskSelected = onTaskSelected;
    }

    public init(): void {
        console.log("Initializing Menu Screen");

        // Create buttons
        const task1Button = new Button("Ace of Shadows", () => this.onTaskSelected(ScreenNames.AceOfShadows));
        const task2Button = new Button("Magic Words", () => this.onTaskSelected(ScreenNames.MagicWords));
        const task3Button = new Button("Phoenix Flame", () => this.onTaskSelected(ScreenNames.PhoenixFlame));

        // Store buttons in an array for easy access
        this.buttons = [task1Button, task2Button, task3Button];

        // Add buttons to the screen
        this.addChild(...this.buttons);

        // Position buttons initially
        this.positionButtons();
    }

    public update(time: Ticker): void {
        // Update logic for the menu (if needed)
    }

    public onResize(): void {
        console.log("Resizing Menu Screen");
        this.positionButtons(); // Reposition buttons on resize
    }

    private positionButtons(): void {
        // Use window.innerWidth and window.innerHeight for accurate dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate the total height of all buttons
        const totalButtonHeight = this.buttons.reduce((sum, button) => sum + button.height, 0);
        const spacing = 20; // Space between buttons

        // Calculate the starting Y position to center the buttons vertically
        let startY = (screenHeight - totalButtonHeight - (this.buttons.length - 1) * spacing) / 2;

        // Position each button
        this.buttons.forEach((button) => {
            button.x = (screenWidth) / 2; // Center horizontally
            button.y = startY; // Set Y position
            startY += button.height + spacing; // Move Y position for the next button
        });
    }
}