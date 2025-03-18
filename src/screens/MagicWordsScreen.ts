import { Ticker, Text, Container, Sprite, Application, Texture } from "pixi.js";
import { Screen } from "../components/Screen";
import { Game } from "../main";

export class MagicWordsScreen extends Screen {

  private dialogueContainer: Container;
  private padding = 10; // Padding between elements
  private avatarMap: Map<string, { url: string; position: string }> = new Map();

  constructor(game: Game) {
    super(game);
    this.dialogueContainer = new Container();
  }

  public async init(): Promise<void> {
    console.log("Initializing Magic Words");

    // Fetch dialogue data
    const dialogueData = await this.fetchDialogueData();
    console.log(dialogueData);

    // Render the dialogue
    this.renderDialogue(dialogueData);

    // Add the dialogue container to the stage
    this.game!.stage.addChild(this.dialogueContainer);
  }

  public update(time: Ticker): void {
    // Update logic (if needed)
  }

  public onResize(): void {
    const screenWidth = this.game!.screen.width;
    const screenHeight = this.game!.screen.height;

    // Reposition the dialogue container
    this.dialogueContainer.position.set(50, 50); // Adjust as needed

    // Adjust the position of each message container
    this.dialogueContainer.children.forEach((messageContainer) => {
      if (messageContainer.children.length < 1) {
        return; // Skip if there are no avatars or name text
      }
      const avatar = messageContainer.getChildAt(0) as Sprite;
      const nameText = messageContainer.getChildAt(1) as Text;

      // Get avatar data
      const avatarData = this.avatarMap.get(nameText.text);
      if (avatarData) {
        const { position } = avatarData;

        // Reposition the avatar based on its position property
        if (position === "right") {
          avatar.x = screenWidth - avatar.width - this.padding; // Align avatar to the right
        } else {
          avatar.x = this.padding; // Align avatar to the left (default)
        }

        // Reposition the name text
        if (position === "right") {
          nameText.x = avatar.x - nameText.width - this.padding; // Position name to the left of the avatar
        } else {
          nameText.x = avatar.x + avatar.width + this.padding; // Position name to the right of the avatar
        }

        // Reposition the dialogue text and emojis
        let xOffset = nameText.x;
        const yTextOffset = nameText.height + this.padding;

        for (let i = 2; i < messageContainer.children.length; i++) {
          const child = messageContainer.getChildAt(i);

          if (child instanceof Sprite || child instanceof Text) {
            child.x = xOffset;
            child.y = yTextOffset;

            if (child instanceof Sprite) {
              xOffset += child.width + this.padding; // Move xOffset for emojis
            } else if (child instanceof Text) {
              xOffset += child.width + this.padding; // Move xOffset for text
            }
          }
        }

        // Align the entire message container based on the `position` property
        if (position === "right") {
          messageContainer.x = screenWidth - xOffset - this.padding; // Align to the right
        }
      }
    });
  }

  private async fetchDialogueData() {
    const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
    const data = await response.json();
    return data;
  }

  private renderDialogue(dialogueData: any) {
    const avatarSize = 64; // Size of the avatar image
    let yOffset = 50; // Vertical offset for each message

    // Populate the avatar map
    dialogueData.avatars.forEach((avatar: any) => {
      this.avatarMap.set(avatar.name, { url: avatar.url, position: avatar.position });
    });

    // Create a map of emojies for quick lookup
    const emojiMap = new Map<string, string>();
    dialogueData.emojies.forEach((emoji: any) => {
      emojiMap.set(emoji.name, emoji.url);
    });

    dialogueData.dialogue.forEach((message: any) => {
      // Create a container for the message
      const messageContainer = new Container();
      messageContainer.y = yOffset;

      // Get avatar data
      const avatarData = this.avatarMap.get(message.name);
      if (avatarData) {
        const { url, position } = avatarData;

        // Load and display the avatar
        const avatar = Sprite.from(url);
        avatar.width = avatarSize;
        avatar.height = avatarSize;

        // Add error handling for texture loading
        avatar.texture.baseTexture.on("error", (error) => {
          console.error(`Failed to load avatar for ${message.name}:`, error);
          // Use a fallback image
          avatar.texture = Texture.from("path/to/fallback.png");
        });

        // Position the avatar based on the `position` property
        if (position === "right") {
          avatar.x = this.game!.screen.width - avatarSize - this.padding; // Align avatar to the right
        } else {
          avatar.x = this.padding; // Align avatar to the left (default)
        }

        messageContainer.addChild(avatar);

        // Display the character name
        const nameText = new Text(message.name, { fill: 0xffffff, fontSize: 14 });
        if (position === "right") {
          nameText.x = avatar.x - nameText.width - this.padding; // Position name to the left of the avatar
        } else {
          nameText.x = avatar.x + avatar.width + this.padding; // Position name to the right of the avatar
        }
        nameText.y = 0; // Align name at the top
        messageContainer.addChild(nameText);

        // Display the dialogue text with emojies
        const dialogueText = message.text;

        // Split the dialogue text into parts (text and emoji placeholders)
        const textParts = dialogueText.split(/(\{[^}]+\})/); // Split by {emotion}

        let xOffset = nameText.x; // Start dialogue text at the name's position
        const yTextOffset = nameText.height + this.padding; // Position dialogue text below the name

        textParts.forEach((part: string) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            // Extract emoji name from {emotion}
            const emojiName = part.slice(1, -1).trim(); // Remove { and } and trim whitespace
            const emojiUrl = emojiMap.get(emojiName);
            if (emojiUrl) {
              const emojiSprite = Sprite.from(emojiUrl);
              emojiSprite.width = 24; // Set emoji size
              emojiSprite.height = 24;
              emojiSprite.x = xOffset;
              emojiSprite.y = yTextOffset;
              messageContainer.addChild(emojiSprite);
              xOffset += 24 + this.padding; // Move xOffset for the next element
            }
          } else {
            // Render regular text
            const text = new Text(part, { fill: 0xffffff, fontSize: 12 });
            text.x = xOffset;
            text.y = yTextOffset;
            messageContainer.addChild(text);
            xOffset += text.width + this.padding; // Move xOffset for the next element
          }
        });

        // Align the entire message container based on the `position` property
        if (position === "right") {
          messageContainer.x = this.game!.screen.width - xOffset - this.padding; // Align to the right
        }
      }

      // Add the message container to the dialogue container
      this.dialogueContainer.addChild(messageContainer);

      // Update yOffset for the next message
      yOffset += avatarSize + this.padding * 2;
    });
  }
}