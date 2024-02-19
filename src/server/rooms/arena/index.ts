import type * as http from 'http';
import { Room, Client } from 'colyseus';
import { ArenaState, PlayerState } from './state';
import constants from '../../../common/constants';
import { PlayerInputPacket } from '../../../common/packets';

export class ArenaRoom extends Room<ArenaState> {
  // @Override -------------------------------------------------------------------------------------
  onCreate() {
    // this.clock.start();
    this.setState(new ArenaState());

    // Set network patch rate, sends out state updates of the world to the clients.
    // 20 packets per second - 50 ms
    this.setPatchRate(constants.NETWORK_BROADCAST_RATE);

    // Set simulation interval, runs the tick loop for the server world.
    // 60 fps - 16.6 ms
    this.setSimulationInterval((deltaMS: number) => {
      const delta: number = deltaMS / 1000; // In seconds.
    }, constants.SIMULATION_TICK_RATE);

    this.onMessage('user_input', (client: Client, message: PlayerInputPacket) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        console.log('[onMessage - user_input] - User input received', message);
        player.input = message;
        // player.inputs.push(message);
        // const { up: isUpPressed, left: isLeftPressed, right: isRightPressed, down: isDownPressed } = message;
        // if (isUpPressed) player.y -= constants.PLAYER_SPEED;
        // if (isDownPressed) player.y += constants.PLAYER_SPEED;
        // if (isLeftPressed) player.x -= constants.PLAYER_SPEED;
        // if (isRightPressed) player.x += constants.PLAYER_SPEED;
      } else {
        console.error('[onMessage] - Receiving user input message from unknown player: ' + client.sessionId);
      }
    });
  }

  fixedTick(delta: number) {}

  // @Override -------------------------------------------------------------------------------------
  onAuth(client: Client, options: any, request: http.IncomingMessage): boolean {
    return !!options.name;
  }

  // @Override -------------------------------------------------------------------------------------
  onJoin(client: Client, options: any) {
    console.log('Player joined the room', client.sessionId);

    const player = new PlayerState();
    player.id = client.sessionId;
    player.x = Math.random() * this.state.width;
    player.y = Math.random() * this.state.height;

    this.state.players.set(player.id, player);
  }

  // @Override -------------------------------------------------------------------------------------
  onLeave(client: Client) {
    console.log('Player left the room', client.sessionId);

    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    } else {
      console.error('[onLeave] - Player is not in the state to be removed: ' + client.sessionId);
    }
  }
}
