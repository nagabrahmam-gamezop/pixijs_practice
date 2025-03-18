import { Ticker, Sprite, Container, Assets, Texture, Rectangle, AnimatedSprite } from "pixi.js";
import { Screen } from "../components/Screen";
import { Game } from "../main";

interface ParticleConfig {
  scale: number;
  alpha: number;
  x: number;
  y: number;
  animationSpeed: number;
}

export class PhoenixFlameScreen extends Screen {
  private fireParticles: AnimatedSprite[] = [];
  private particleContainer: Container;
  private readonly PARTICLE_COUNT = 10;
  private readonly FRAME_WIDTH = 128;
  private readonly FRAME_HEIGHT = 128;
  private readonly FRAME_COUNT = 4;

  constructor(game: Game) {
    super(game);
    this.particleContainer = new Container();
    this.addChild(this.particleContainer);
  }

  public async init(): Promise<void> {
    console.log("Initializing Phoenix Flame");
    const frames = await this.loadSpritesheet();
    await this.createParticles(frames);
  }

  private async loadSpritesheet(): Promise<Texture[]> {
    const fireSpriteSheet = await Assets.load("./../assets/flame_frames.png");
    return this.createFrames(fireSpriteSheet);
  }

  private createFrames(spriteSheet: Texture): Texture[] {
    const frames: Texture[] = [];
    for (let i = 0; i < this.FRAME_COUNT; i++) {
      const frameTexture = new Texture({
        source: spriteSheet.baseTexture,
        frame: new Rectangle(
          i * this.FRAME_WIDTH,
          0,
          this.FRAME_WIDTH,
          this.FRAME_HEIGHT
        ),
      });
      frames.push(frameTexture);
    }
    return frames;
  }

  private getParticleConfig(): ParticleConfig {
    return {
      scale: 2 + Math.random() * 0.25,
      alpha: 0.7 + Math.random() * 0.3,
      x: this.game!.screen.width * 0.5,
      y: this.game!.screen.height * 0.6 + Math.random() * 10,
      animationSpeed: 0.5
    };
  }

  private createParticle(frames: Texture[], config: ParticleConfig): AnimatedSprite {
    const particle = new AnimatedSprite(frames);
    particle.anchor.set(0.5);
    particle.scale.set(config.scale);
    particle.alpha = config.alpha;
    particle.x = config.x;
    particle.y = config.y;
    particle.animationSpeed = config.animationSpeed;
    (particle as any).active = false;
    return particle;
  }

  private async createParticles(frames: Texture[]): Promise<void> {
    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      const config = this.getParticleConfig();
      const particle = this.createParticle(frames, config);
      particle.play();

      if (i > 0) {
        this.fireParticles.push(particle);
      }
      this.particleContainer.addChild(particle);

      setTimeout(() => this.animateParticle(particle), i * 200);
    }
  }

  public update(time: Ticker): void {
    this.updateParticles(time.deltaTime);
  }

  private updateParticles(deltaTime: number): void {
    this.fireParticles.forEach((particle) => {
      if ((particle as any).active) {
        this.updateParticlePosition(particle, deltaTime);
        this.updateParticleAlpha(particle, deltaTime);
        this.checkAndResetParticle(particle);
      }
    });
  }

  private updateParticlePosition(particle: AnimatedSprite, deltaTime: number): void {
    const angle = (-40 + Math.random() * 80) * (Math.PI / 180);
    const speed = 1 + Math.random() * 2;
    particle.x += Math.sin(angle) * speed * deltaTime;
    particle.y -= Math.cos(angle) * speed * deltaTime;
  }

  private updateParticleAlpha(particle: AnimatedSprite, deltaTime: number): void {
    particle.alpha -= 0.01 * deltaTime;
  }

  private checkAndResetParticle(particle: AnimatedSprite): void {
    if (particle.alpha <= 0 || particle.y < 0) {
      const config = this.getParticleConfig();
      particle.x = config.x;
      particle.y = config.y;
      particle.alpha = config.alpha;
      particle.scale.set(config.scale);
    }
  }

  public onResize(): void {
    console.log("Resizing Phoenix Flame Screen");
    this.fireParticles.forEach(particle => {
      particle.x = this.game!.screen.width * 0.5;
      particle.y = this.game!.screen.height * 0.75;
    });
  }

  private animateParticle(particle: Sprite): void {
    (particle as any).active = true;
  }
}