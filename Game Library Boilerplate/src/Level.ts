import Texture from '../raptor/Texture';
import TileMap, { Tile } from '../raptor/TileMap';
import math from '../utils/math';
import { Pos } from '../utils/types';

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const texture = new Texture('res/images/tiles.png');

class Level extends TileMap {
  bounds: Bounds;
  blank: Pos;
  lastTile: Tile | null;
  totalFreeSpots: number;

  constructor(w: number, h: number) {
    const tileSize = 32;
    const mapW = Math.ceil(w / tileSize);
    const mapH = Math.ceil(h / tileSize);

    const level = [];
    let totalFreeSpots = 0;
    for (let i = 0; i < mapW * mapH; i++) {
      const isTopOrBottom = i < mapW || Math.floor(i / mapW) === mapH - 1;
      const isLeft = i % mapW === 0;
      const isRight = i % mapW === mapW - 1;
      const isSecondRow = ((i / mapW) | 0) === 1;

      if (isTopOrBottom) {
        level.push({ x: 2, y: 1 });
      } else if (isLeft) {
        level.push({ x: 1, y: 1 });
      } else if (isRight) {
        level.push({ x: 3, y: 1 });
      } else if (isSecondRow) {
        level.push({ x: 4, y: 1 });
      } else {
        // Random ground tile
        level.push({ x: math.rand(1, 5), y: 0 });
        totalFreeSpots++;
      }
    }

    super(level, mapW, mapH, tileSize, tileSize, texture);

    this.bounds = {
      left: tileSize,
      right: w - tileSize * 2,
      top: tileSize * 2,
      bottom: h - tileSize * 2,
    };

    this.totalFreeSpots = totalFreeSpots;
    this.blank = { x: 0, y: 0 };
    this.lastTile = null;
  }

  checkGround(pos: Pos) {
    const { blank, lastTile } = this;
    const tile = this.tileAtPixelPos(pos);
    if (lastTile === tile) {
      return 'checked';
    }
    this.lastTile = tile;
    if (tile.frame !== blank && !!blank) {
      this.setFrameAtPixelPos(pos, blank);
      return 'solid';
    }
    return 'cleared';
  }
}

export default Level;
