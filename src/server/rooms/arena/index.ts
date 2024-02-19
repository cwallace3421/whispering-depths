import type * as http from "http";
import { Room, Client } from "colyseus";
import { ArenaState } from "./state";
import constants from "../../../common/constants";


export class ArenaRoom extends Room<ArenaState> {

    // @Override -------------------------------------------------------------------------------------
    onCreate() {
        this.clock.start();
        this.setState(new ArenaState());

        // Set network patch rate, sends out state updates of the world to the clients.
        // 20 packets per second - 50 ms
        this.setPatchRate(constants.NETWORK_BROADCAST_RATE);

        // Set simulation interval, runs the tick loop for the server world.
        // 60 fps - 16.6 ms
        this.setSimulationInterval((delta: number) => {
            const deltaTime: number = delta / 1000;
        }, constants.SIMULATION_TICK_RATE);
    }

    // @Override -------------------------------------------------------------------------------------
    onAuth(client: Client, options: any, request: http.IncomingMessage): boolean {
        return !!options.name;
    }

    // @Override -------------------------------------------------------------------------------------
    onJoin(client: Client, options: any) {
        console.log('Player joined the room', client.sessionId);
    }

    // @Override -------------------------------------------------------------------------------------
    onLeave(client: Client) {
        console.log('Player left the room', client.sessionId);
    }

}