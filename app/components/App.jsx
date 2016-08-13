import React from 'react';
import Players from './Players.jsx';
import {NEW_PLAYER, RESET, NEW_SCORE, SCORE_CHANGED, bus$} from './bus.js';

export default React.createClass({
  getInitialState: function() {
    return {scores: []};
  },

  componentDidMount: function componentDidMount() {
    bus$.onValue((function (action) {
      switch (action.type) {
        case NEW_PLAYER:
          this.state.scores.push([]);
          this.setState({scores: this.state.scores});
          break;
        case RESET:
          this.setState({scores: []});
          break;
        case NEW_SCORE:
          if (!action.value) {
            return;
          }
          this.state.scores[action.playerId].push(action.value);
          this.setState({scores: this.state.scores});
          break;
        case SCORE_CHANGED:
          this.state.scores[action.playerId][action.index] = action.value;
          this.setState({scores: this.state.scores});
          break;
      }
    }).bind(this));

    bus$.push({type: NEW_PLAYER});
  },

  render: function() {
    return(
      <Players scores={this.state.scores} />
    );
  }
});
