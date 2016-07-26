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
    return {value: this.props.value};
  },

  change: function() {
    var value = parseInt(prompt('Enter a new value'));
    if (value) {
      this.setState({value: value});
      scores$.push({value: value, index: this.props.index});
    }
  },

  render: function() {
    return(
      <div>
        <h2 onClick={this.change}>{this.state.value}</h2>
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

var scores$ = new Bacon.Bus();

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

    scores$.onValue((function (score) {
      this.state.scores[score.index] = score.value;
      this.setState({scores: this.state.scores});
    }).bind(this));
  },

  render: function() {
    var total = 0;
    var scores = this.state.scores.map(function(value, index) {
      total += value;
      console.log(index)
      return <Score value={value} key={index} index={index} />;
    });

    return(
      <div>
        <Name />
        {scores}
        <h3>Total: {total}</h3>
        <NewScore />
      </div>
    );
  }
});
