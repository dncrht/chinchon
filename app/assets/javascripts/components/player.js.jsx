Name = React.createClass({
  getInitialState: function() {
    return {name: 'Jugador ' + (this.props.playerId + 1)};
  },

  setName: function(event) {
    this.setState({name: event.target.value});
  },

  render: function() {
    return(
      <div>
        <input onChange={this.setName} value={this.state.name} />
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
      scores$.push({playerId: this.props.playerId, value: value, index: this.props.index});
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

MinusTen = React.createClass({
  send: function() {
    newScore$.push({playerId: this.props.playerId, value: -10});
  },

  render: function() {
    return(
      <div>
        <button onClick={this.send}>-10</button>
      </div>
    );
  }
});

NewScore = React.createClass({
  getInitialState: function() {
    return {value: 0};
  },

  setValue: function(event) {
    this.setState({value: parseInt(event.target.value)});
  },

  send: function() {
    newScore$.push({playerId: this.props.playerId, value: this.state.value});
    this.setState({value: 0});
  },

  render: function() {
    return(
      <div>
        <input onChange={this.setValue} value={this.state.value} />
        <button onClick={this.send}>+</button>
      </div>
    );
  }
});

var newScore$ = new Bacon.Bus();
var scores$ = new Bacon.Bus();

Player = React.createClass({
  getInitialState: function() {
    return {scores: []};
  },

  componentDidMount: function componentDidMount() {
    newScore$.onValue((function (score) {
      if (score.playerId != this.props.playerId) {
        return;
      }
      if (!score.value) {
        return;
      }
      this.state.scores.push(score.value);
      this.setState({scores: this.state.scores});
    }).bind(this));

    scores$.onValue((function (score) {
      if (score.playerId != this.props.playerId) {
        return;
      }
      this.state.scores[score.index] = score.value;
      this.setState({scores: this.state.scores});
    }).bind(this));
  },

  render: function() {
    var total = 0;
    var scores = this.state.scores.map(function(value, index) {
      total += value;
      return <Score value={value} key={index} index={index} playerId={this.props.playerId} />;
    }.bind(this));

    return(
      <div>
        <Name playerId={this.props.playerId} />
        {scores}
        <h3>Total: {total}</h3>
        <MinusTen playerId={this.props.playerId} />
        <NewScore playerId={this.props.playerId} />
      </div>
    );
  }
});

Players = React.createClass({
  getInitialState: function() {
    return {players: 1};
  },

  newPlayer: function() {
    this.setState({players: this.state.players + 1});
  },

  clean: function() {
    this.setState({players: 0});
  },

  render: function() {
    var players = [];
    for (var i = 0; i < this.state.players; i++) {
      players.push(<Player key={i} playerId={i} />);
    }

    return(
      <div>
        <button onClick={this.newPlayer}>+</button>
        <button onClick={this.clean}>⟲</button>
        {players}
      </div>
    );
  }
});
