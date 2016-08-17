import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {oldName: '', name: 'Jugador ' + (this.props.playerId + 1)};
  },

  onChange: function(event) {
    this.setState({name: event.target.value.trim()});
  },

  onFocus: function(event) {
    this.setState({oldName: this.state.name});
    event.target.select();
  },

  onBlur: function() {
    this.setState({name: this.state.oldName});
  },

  onKeyUp: function(event) {
    switch (event.keyCode) {
      case 13:
        this.setState({oldName: this.state.name}, (function(target) {
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
      <div>
        <input type="text" className="input_player" onBlur={this.onBlur} onKeyUp={this.onKeyUp} onFocus={this.onFocus} onChange={this.onChange} value={this.state.name} />
      </div>
    );
  }
});
