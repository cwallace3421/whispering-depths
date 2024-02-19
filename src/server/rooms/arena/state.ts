import { Schema, type } from '@colyseus/schema';
import constants from '../../../common/constants';

export class ArenaState extends Schema {
  @type('uint8')
  width: number = constants.WORLD_SIZE;

  @type('uint8')
  height: number = constants.WORLD_SIZE;
}
