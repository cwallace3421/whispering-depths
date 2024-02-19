import Phaser from 'phaser';
import { Room, Client } from 'colyseus.js';
import constants from '../../common/constants';
import type { ArenaState } from '../../server/rooms/arena/state';

export default class ArenaScene extends Phaser.Scene {
  private client: Client | undefined;
  private room: Room | undefined;

  // -----------------------------------------------------------------------------------------------
  constructor() {
    super({ key: 'arena-scene' });
  }

  init() {
    const protocol = window.location.host.includes('localhost') ? 'ws' : 'wss';
    const endpoint = `${protocol}://${window.location.host}`;
    this.client = new Client(endpoint);

    this.resize();
    this.scale.on('resize', this.resize.bind(this));
  }

  // -----------------------------------------------------------------------------------------------
  preload() {}

  // -----------------------------------------------------------------------------------------------
  async create() {
    const playerName = (window as any).game.state.name;
    this.room = await this.client?.joinOrCreate<ArenaState>(constants.ROOM_NAME, { name: playerName });
  }

  // -----------------------------------------------------------------------------------------------
  update(time: number, delta: number): void {}

  // -----------------------------------------------------------------------------------------------
  resize(): void {
    this.cameras.main.setScroll(-(this.scale.width / 2) + constants.WORLD_SIZE / 2, -(this.scale.height / 2) + constants.WORLD_SIZE / 2);
  }
}
