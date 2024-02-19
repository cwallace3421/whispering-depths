type BasePacket = {
  timestamp: number;
};

export type PlayerInputPacket = BasePacket & {
  up?: boolean;
  left?: boolean;
  right?: boolean;
  down?: boolean;
};
