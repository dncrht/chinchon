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

Player = function(props) {
  var scores = props.scores.map(function(value, index) {
    return <Score value={value} key={index} index={index} playerId={props.playerId} />;
  });

  return(
    <div>
      <Name playerId={props.playerId} />
      #{props.position + 1}
      {scores}
      <h3>Total: {props.total}</h3>
      <MinusTen playerId={props.playerId} />
      <NewScore playerId={props.playerId} />
    </div>
  );
};

Players = React.createClass({
  getInitialState: function() {
    return {scores: []};
  },

  componentDidMount: function componentDidMount() {
    bus$.onValue((function (action) {
      switch (action.type) {
        case NEW_SCORE:
          if (!action.value) {
            return;
          }
          this.state.scores[action.playerId].push(action.value);
          this.setState({scores: this.state.scores});

          this.calculateTotal(this.state.scores[action.playerId]);
          break;
        case SCORE_CHANGED:
          this.state.scores[action.playerId][action.index] = action.value;
          this.setState({scores: this.state.scores});

          this.calculateTotal(this.state.scores[action.playerId]);
          break;
      }
    }).bind(this));

    this.newPlayer();
  },

  calculatePosition: function(i) {
    var totals = this.state.scores.map(function(scores) {return this.getTotal(scores);}.bind(this));
    var value = totals[i];
    var sortedTotals = Object.values(totals).sort(function(a, b) {return b - a;})
    return sortedTotals.indexOf(value);
  },

  newPlayer: function() {
    this.state.scores.push([])
    this.setState({scores: this.state.scores});
  },

  clean: function() {
    this.setState({scores: []});
  },

  getPosition: function(i) {
    return this.calculatePosition(i);
  },

  getTotal: function(scores) {
    var total = 0;
    if (scores.length > 0) {
      total = Object.values(scores).reduce(function(previousValue, currentValue) {
        return previousValue + currentValue;
      });
    }
    return total;
  },

  getNumberOfPlayers: function() {
    return Object.keys(this.state.scores).length;
  },

  render: function() {
    var players = [];
    for (var i = 0; i < this.getNumberOfPlayers(); i++) {
      var scores = this.state.scores[i];
      players.push(<td><Player key={i} playerId={i} scores={scores} total={this.getTotal(scores)} position={this.getPosition(i)} /></td>);
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
