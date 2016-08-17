import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {name: 'Jugador ' + (this.props.playerId + 1)};
  },

  onChange: function(event) {
    this.setState({name: event.target.value.trim()});
  },

  onFocus: function(event) {
    event.target.select();
  },

  onKeyUp: function(event) {
    if (event.keyCode == 13) {
      event.target.blur();
    }
  },

  render: function() {
    return(
      <div>
        <input type="text" className="input_player" onKeyUp={this.onKeyUp} onFocus={this.onFocus} onChange={this.onChange} value={this.state.name} />
      </div>
    );
  }
});
