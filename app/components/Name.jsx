import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {name: 'Jugador ' + (this.props.playerId + 1)};
  },

  setName: function(event) {
    var value = prompt('Introduce el nombre', this.state.name);
    if (!value) {
      return;
    }
    value = value.trim();
    if (value.length > 0) {
      this.setState({name: value});
    }
  },

  render: function() {
    return(
      <h3 onClick={this.setName} className="actionable text-xs-center">{this.state.name}</h3>
    );
  }
});
