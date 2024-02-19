import { MapSchema, Schema, type } from '@colyseus/schema';
import constants from '../../../common/constants';
import { PlayerInputPacket } from '../../../common/packets';

export class PlayerState extends Schema {
  @type('string')
  id!: string;

  @type('number')
  x!: number;

  @type('number')
  y!: number;

  input: PlayerInputPacket | undefined;
}

export class ArenaState extends Schema {
  @type('uint8')
  width: number = constants.WORLD_SIZE;

  @type('uint8')
  height: number = constants.WORLD_SIZE;

  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();
}
