import React from 'react';
import {SCORE_CHANGED, bus$} from './bus.js';

export default React.createClass({
  getInitialState: function() {
    return {oldValue: '', value: this.props.value};
  },

  onChange: function(event) {
    this.setState({value: event.target.value});
  },

  onFocus: function(event) {
    this.setState({oldValue: this.state.value});
    event.target.select();
  },

  onBlur: function() {
    this.setState({value: this.state.oldValue});
  },

  onKeyUp: function(event) {
    switch (event.keyCode) {
      case 13:
        bus$.push({type: SCORE_CHANGED, playerId: this.props.playerId, value: parseInt(this.state.value), index: this.props.index});
        this.setState({oldValue: this.state.value}, (function(target) {
          return function() {
            target.blur();
          }
        })(event.target));
        break;
      case 27:
        event.target.blur();
        break;
    }
  },

  render: function() {
    return(
      <tr>
        <td>
          <input type="number" className="input_score golden actionable" onBlur={this.onBlur} onKeyUp={this.onKeyUp} onFocus={this.onFocus} onChange={this.onChange} value={this.state.value} />
        </td>
      </tr>
    );
  }
});
