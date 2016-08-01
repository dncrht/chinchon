TOTAL_CALCULATED = 'TOTAL_CALCULATED';
SCORE_CHANGED = 'SCORE_CHANGED';
NEW_SCORE = 'NEW_SCORE';
var bus$ = new Bacon.Bus();

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
      bus$.push({type: SCORE_CHANGED, playerId: this.props.playerId, value: value, index: this.props.index});
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
    bus$.push({type: NEW_SCORE, playerId: this.props.playerId, value: -10});
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

  onKeyUp: function(event) {
    if (event.keyCode == 13) {
      this.send();
    };
  },

  onChange: function(event) {
    this.setState({value: event.target.value});
  },

  send: function() {
    var value = parseInt(this.state.value);
    if (!isNaN(value)) {
      bus$.push({type: NEW_SCORE, playerId: this.props.playerId, value: value});
      this.setState({value: 0});
    }
  },

  onFocus: function(event) {
    event.target.select();
  },

  render: function() {
    return(
      <div>
        <input onFocus={this.onFocus} onKeyUp={this.onKeyUp} onChange={this.onChange} value={this.state.value} />
        <button onClick={this.send}>+</button>
      </div>
    );
  }
});

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
    bus$.push({type: TOTAL_CALCULATED, index: this.props.playerId, total: total});
  },

  componentDidMount: function componentDidMount() {
    bus$.onValue((function (action) {
      switch (action.type) {
        case NEW_SCORE:
          if (action.playerId != this.props.playerId) {
            return;
          }
          if (!action.value) {
            return;
          }
          this.state.scores.push(action.value);
          this.setState({scores: this.state.scores});

          this.calculateTotal(this.state.scores);
          break;
        case SCORE_CHANGED:
          if (action.playerId != this.props.playerId) {
            return;
          }
          this.state.scores[action.index] = action.value;
          this.setState({scores: this.state.scores});

          this.calculateTotal(this.state.scores);
          break;
      }
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
    return {players: 0, playerTotals: {}};
  },

  componentDidMount: function componentDidMount() {
    bus$.onValue((function (action) {
      if (action.type == TOTAL_CALCULATED) {
        this.state.playerTotals[action.index] = action.total;
        this.setState({
          playerTotals: this.state.playerTotals
        });
      }
    }).bind(this));

    this.newPlayer();
  },

  calculatePosition: function(i) {
    var totals = this.state.playerTotals;
    var value = this.state.playerTotals[i];
    var sortedTotals = Object.values(totals).sort(function(a, b) {return b - a;})
    return sortedTotals.indexOf(value);
  },

  newPlayer: function() {
    this.setState({players: this.state.players + 1});
  },

  clean: function() {
    this.setState({
      players: 0,
      playerTotals: {}
    });
  },

  getPosition: function(i) {
    return this.calculatePosition(i);
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
