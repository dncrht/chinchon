import React from 'react';
import {SCORE_CHANGED, bus$} from './bus.js';

export default React.createClass({
  getInitialState: function() {
    return {value: this.props.value};
  },

  change: function() {
    var value = parseInt(prompt('Introduce una nueva puntuación'));
    if (value) {
      this.setState({value: value});
      bus$.push({type: SCORE_CHANGED, playerId: this.props.playerId, value: value, index: this.props.index});
    }
  },

  render: function() {
    return(
      <tr>
        <td onClick={this.change} className="golden actionable">{this.state.value}</td>
      </tr>
    );
  }
});
