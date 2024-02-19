import Phaser from 'phaser';
import ArenaScene from './scenes/ArenaScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6495ED,
    pixelArt: true,
    scene: [ArenaScene],
};

export function init(): Phaser.Game {
    return new Phaser.Game(config);
}