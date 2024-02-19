import constants from './constants';
import { PlayerInputPacket } from './packets';

export function move(delta: number, x: number, y: number, packet: PlayerInputPacket): { x: number; y: number } {
  let newX = x;
  let newY = y;

  if (packet.left) {
    newX -= constants.PLAYER_SPEED;
  } else if (packet.right) {
    newX += constants.PLAYER_SPEED;
  }

  if (packet.up) {
    newY -= constants.PLAYER_SPEED;
  } else if (packet.down) {
    newY += constants.PLAYER_SPEED;
  }

  return { x: newX, y: newY };
}
