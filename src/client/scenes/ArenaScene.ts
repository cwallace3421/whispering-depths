import Phaser from 'phaser';
import { Room, Client } from 'colyseus.js';
import constants from '../../common/constants';
import { ArenaState } from '../../server/rooms/arena/state';
import { PlayerInputPacket } from '../../common/packets';

export default class ArenaScene extends Phaser.Scene {
  // -----------------------------------------------------------------------------------------------
  private client: Client | undefined;
  private room: Room<ArenaState> | undefined;
  // -----------------------------------------------------------------------------------------------
  private players: { [id: string]: Phaser.GameObjects.Container } = {};
  private serverPlayers: { [id: string]: Phaser.GameObjects.Container } = {};
  private self: string | undefined;
  // -----------------------------------------------------------------------------------------------
  private keyboard: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  // -----------------------------------------------------------------------------------------------

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
  preload() {
    this.keyboard = this.input.keyboard?.createCursorKeys();
  }

  // -----------------------------------------------------------------------------------------------
  async create() {
    if (!this.client) return;

    const playerName = (window as any).game.state.name;
    this.room = await this.client.joinOrCreate<ArenaState>(constants.ROOM_NAME, { name: playerName }, ArenaState);

    if (!this.room) return;

    console.log('[Phaser.create] - Room created');

    this.room.state.players.onAdd((player, id) => {
      if (this.room?.sessionId === id) {
        this.self = this.room.sessionId;
      }

      const circle = this.add.ellipse(0, 0, 30 * 2, 30 * 2, 0x4257f5);
      this.players[id] = this.add.container(player.x, player.y, [circle]).setDataEnabled();

      player.onChange(() => {
        // TODO: Change to "listen".
        this.serverPlayers[id].x = player.x;
        this.serverPlayers[id].y = player.y;

        this.players[id].setData('target_x', player.x);
        this.players[id].setData('target_y', player.y);
      });

      player.onRemove(() => {
        delete this.players[id];
        delete this.serverPlayers[id];
      });
    });
  }

  // -----------------------------------------------------------------------------------------------
  update(time: number, deltaMS: number): void {
    const delta = deltaMS / 1000; // In seconds.

    if (!this.room) return undefined;

    this.room.send('user_input', {
      timestamp: +new Date(),
      up: this.keyboard?.up.isDown,
      left: this.keyboard?.left.isDown,
      right: this.keyboard?.right.isDown,
      down: this.keyboard?.down.isDown,
    } satisfies PlayerInputPacket);

    for (const id in this.players) {
      const entity = this.players[id];
      const { target_x, target_y } = entity.data.values;
      if (typeof target_x === 'number') {
        entity.x = Phaser.Math.Linear(entity.x, target_x, 0.2);
      }
      if (typeof target_y === 'number') {
        entity.y = Phaser.Math.Linear(entity.y, target_y, 0.2);
      }
    }
  }

  // -----------------------------------------------------------------------------------------------
  resize(): void {
    this.cameras.main.setScroll(-(this.scale.width / 2) + constants.WORLD_SIZE / 2, -(this.scale.height / 2) + constants.WORLD_SIZE / 2);
  }
}
