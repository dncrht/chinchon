import React from 'react';
import {translate} from 'react-i18next';

const Name = React.createClass({
  getInitialState: function() {
    const {t} = this.props;

    return {oldName: '', name: t('player') + ' ' + (this.props.playerId + 1)};
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

export default translate(null, {wait: true})(Name);
