//Inspired by: https://github.com/ahung89/bomb-arena/blob/master/server/entities/map.js

class Map {
  constructor(data, tileSize){
    this.mapData = []
    this.tileSize = tileSize
    this.tiles = data.tiles
  }
}

exports.Map = Map
