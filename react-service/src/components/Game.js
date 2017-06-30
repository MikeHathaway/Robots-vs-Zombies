import React, { Component } from 'react';
import Iframe from 'react-iframe'

class Game extends Component {
  render() {
    return(
      <div>
        <Iframe url="http://localhost:9000" />
      </div>
    )
  }
}

export default Game
