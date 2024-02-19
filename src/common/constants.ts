export default {
  ROOM_NAME: 'arena',
  WORLD_SIZE: 800,

  PLAYER_SPEED: 5,

  FIXED_TIME_STEP: 1000 / 30, // 30 updates a second

  NETWORK_BROADCAST_RATE: 1000 / 20, // 50ms = 20 packets a second
  // SIMULATION_TICK_RATE: 1000 / 20, // 50ms = 20 updates a second
  SIMULATION_TICK_RATE: 1000 / 60, // 16.66 = 60fps
  SIMULATED_LATENCY: 20, // This is latency for both outgoing and incoming, so this value is doubled in the real world

  ROOM_SIZE: 5,
};
