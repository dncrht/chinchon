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
var position$ = new Bacon.Bus();

Player = React.createClass({
  getInitialState: function() {
    return {scores: [], total: 0};
  },

  calculateTotal: function(scores) {
    var total = 0;
    if (scores.length > 0) {
      total = Object.values(scores).reduce(function(previousValue, currentValue) {
        return previousValue + currentValue;
      });
    }
    this.setState({total: total});
    position$.push({index: this.props.playerId, total: total});
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

      this.calculateTotal(this.state.scores);
    }).bind(this));

    scores$.onValue((function (score) {
      if (score.playerId != this.props.playerId) {
        return;
      }
      this.state.scores[score.index] = score.value;
      this.setState({scores: this.state.scores});

      this.calculateTotal(this.state.scores);
    }).bind(this));

    this.calculateTotal(this.state.scores);
  },

  render: function() {
    var scores = this.state.scores.map(function(value, index) {
      return <Score value={value} key={index} index={index} playerId={this.props.playerId} />;
    }.bind(this));

    return(
      <div>
        <Name playerId={this.props.playerId} />
        #{this.props.position + 1}
        {scores}
        <h3>Total: {this.state.total}</h3>
        <MinusTen playerId={this.props.playerId} />
        <NewScore playerId={this.props.playerId} />
      </div>
    );
  }
});

Players = React.createClass({
  getInitialState: function() {
    return {players: 1, playerTotals: {}, positions: {}};
  },

  componentDidMount: function componentDidMount() {
    position$.onValue((function (playerTotal) {
      this.state.playerTotals[playerTotal.index] = playerTotal.total;
      this.setState({
        playerTotals: this.state.playerTotals,
        positions: this.calculatePosition(this.state.playerTotals)
      });
    }).bind(this));
  },

  calculatePosition: function(totals) {
    var positions = {};
    var position = 0;
    Object.values(totals).sort(function(a, b) {return b - a;}).map(function(value){
      var index = Object.keys(totals).find(function(key) {return totals[key] === value});
      positions[position++] = index;
    });
    return positions;
  },

  newPlayer: function() {
    this.setState({players: this.state.players + 1});
  },

  clean: function() {
    this.setState({players: 0});
  },

  getPosition: function(i) {
    var position = parseInt(this.state.positions[i]);
    if (!isNaN(position)) {
      return position;
    } else {
      return 0;
    }
  },

  render: function() {
    var players = [];
    for (var i = 0; i < this.state.players; i++) {
      players.push(<td><Player key={i} playerId={i} position={this.getPosition(i)} /></td>);
    }

    return(
      <div>
        <button onClick={this.newPlayer}>+</button>
        <button onClick={this.clean}>⟲</button>
        <table>
          <tbody>
            <tr>
              {players}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
