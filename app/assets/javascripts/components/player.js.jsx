Name = React.createClass({
  getInitialState: function() {
    return {name: 'Jugador 1'};
  },

  render: function() {
    return(
      <div>
        <input value={this.state.name} />
      </div>
    );
  }
});

Score = React.createClass({
  getInitialState: function() {
    return {total: this.props.total, value: this.props.value, index: this.props.index};
  },

  render: function() {
    return(
      <div>
        <input value={this.state.value} />
        <h3>{this.props.total}</h3>
      </div>
    );
  }
});

NewScore = React.createClass({
  clear: function() {
    $('[data-js=newScore-input]').val('');
  },

  render: function() {
    return(
      <div>
        <input data-js="newScore-input" />
        <button onClick={this.clear} data-js="newScore-button">+</button>
      </div>
    );
  }
});

var newScore$ = $(document).asEventStream('click', '[data-js=newScore-button]').map(function() {
  return parseInt($('[data-js=newScore-input]').val());
});

Player = React.createClass({
  getInitialState: function() {
    return {scores: []};
  },

  componentDidMount: function componentDidMount() {
    newScore$.onValue((function (value) {
      if (!value) {
        return;
      }
      this.state.scores.push(value);
      this.setState({scores: this.state.scores});
    }).bind(this));
  },

  render: function() {
    var total = 0;
    var scores = this.state.scores.map(function(value, index) {
      total += value;
      return <Score value={value} key={index} total={total} />;
    }.bind(this));

    return(
      <div>
        <Name />
        {scores}
        <NewScore />
      </div>
    );
  }
});
