import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';

const Input = React.createClass({
  getInitialState: function() {
    return {value: 0};
  },

  componentDidMount: function() {
    this.input.focus();
    this.input.select();
  },

  onChange: function(event) {
    this.setState({value: event.target.value});
  },

  onKeyUp: function(event) {
    switch (event.keyCode) {
      case 13:
        this.props.send(parseInt(this.state.value));
        break;
      case 27:
        this.input.blur();
        break;
    }
  },

  render: function() {
    return(
      <input type="number" className="input-button" ref={(c) => this.input = c} onKeyUp={this.onKeyUp} onChange={this.onChange} onBlur={this.props.onClick} value={this.state.value} />
    );
  }
});

export default React.createClass({
  getInitialState: function() {
    return {enterMode: false, value: 0};
  },

  onClick: function() {
    this.setState({value: 0, enterMode: (!this.state.enterMode != false)});
  },

  send: function(value) {
    bus$.push({type: NEW_SCORE, playerId: this.props.playerId, value: value});
    this.setState({enterMode: false});
  },

  render: function() {
    var widget;
    if (!this.state.enterMode) {
      widget = <button onClick={this.onClick} type="button" className="btn btn-primary">Anotar puntos</button>;
    } else {
      widget = <Input onClick={this.onClick} send={this.send} />;
    }

    return(
      <div className="m-b-1">
        {widget}
      </div>
    );
  }
});
