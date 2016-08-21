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
    if (this.state.value == '') {
      this.setState({value: this.state.oldValue});
    } else {
      bus$.push({type: SCORE_CHANGED, playerId: this.props.playerId, value: parseInt(this.state.value), index: this.props.index});
      this.setState({oldValue: this.state.value});
    }
  },

  onKeyUp: function(event) {
    switch (event.keyCode) {
      case 13:
        event.target.blur();
        break;
      case 27:
        this.setState({value: this.state.oldValue}, (function(target) {
          return function() {
            target.blur();
          }
        })(event.target));
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
