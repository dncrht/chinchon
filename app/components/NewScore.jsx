import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';
import {translate} from 'react-i18next';

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

  onBlur: function() {
    this.props.send(this.state.value);
  },

  onKeyUp: function(event) {
    switch (event.keyCode) {
      case 13:
        this.onBlur();
        break;
      case 27:
        this.setState({value: ''}, () => {
          this.onBlur();
        });
        break;
    }
  },

  render: function() {
    return(
      <input type="number" className="input-button" ref={(c) => this.input = c} onKeyUp={this.onKeyUp} onChange={this.onChange} onBlur={this.onBlur} value={this.state.value} />
    );
  }
});

const NewScore = React.createClass({
  getInitialState: function() {
    return {enterMode: false, value: 0};
  },

  onClick: function() {
    this.setState({value: 0, enterMode: true});
  },

  send: function(value) {
    if (value != '') {
      bus$.push({type: NEW_SCORE, playerId: this.props.playerId, value: parseInt(value)});
    }
    this.setState({enterMode: false});
  },

  render: function() {
    const {t} = this.props;
    var widget;
    if (!this.state.enterMode) {
      widget = <button onClick={this.onClick} type="button" className="btn btn-primary">{t('add_score')}</button>;
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

export default translate(null, {wait: true})(NewScore);
