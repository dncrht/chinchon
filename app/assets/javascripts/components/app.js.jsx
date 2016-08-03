NEW_PLAYER = 'NEW_PLAYER';
RESET = 'RESET';
SCORE_CHANGED = 'SCORE_CHANGED';
NEW_SCORE = 'NEW_SCORE';

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

MinusTen = function(props) {
  var send = function() {
    bus$.push({type: NEW_SCORE, playerId: props.playerId, value: -10});
  };

  return(
    <div>
      <button onClick={send}>-10</button>
    </div>
  );
};

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

Players = function(props) {
  var newPlayer = function() {
    bus$.push({type: NEW_PLAYER});
  };

  var reset = function() {
    bus$.push({type: RESET});
  };

  var getPosition = function(i) {
    var totals = props.scores.map(function(scores) {return getTotal(scores);});
    var value = totals[i];
    var sortedTotals = Object.values(totals).sort(function(a, b) {return a - b;})
    return sortedTotals.indexOf(value);
  };

  var getTotal = function(scores) {
    var total = 0;
    if (scores.length > 0) {
      total = Object.values(scores).reduce(function(previousValue, currentValue) {
        return previousValue + currentValue;
      });
    }
    return total;
  };

  var numberOfPlayers = props.scores.length;

  var players = [];
  for (var i = 0; i < numberOfPlayers; i++) {
    var scores = props.scores[i];
    players.push(<td><Player key={i} playerId={i} scores={scores} total={getTotal(scores)} position={getPosition(i)} /></td>);
  }

  return(
    <div>
      <button onClick={newPlayer}>+</button>
      <button onClick={reset}>⟲</button>
      <table>
        <tbody>
          <tr>
            {players}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

App = React.createClass({
  getInitialState: function() {
    return {scores: []};
  },

  componentDidMount: function componentDidMount() {
    bus$.onValue((function (action) {
      switch (action.type) {
        case NEW_PLAYER:
          this.state.scores.push([]);
          this.setState({scores: this.state.scores});
          break;
        case RESET:
          this.setState({scores: []});
          break;
        case NEW_SCORE:
          if (!action.value) {
            return;
          }
          this.state.scores[action.playerId].push(action.value);
          this.setState({scores: this.state.scores});
          break;
        case SCORE_CHANGED:
          this.state.scores[action.playerId][action.index] = action.value;
          this.setState({scores: this.state.scores});
          break;
      }
    }).bind(this));

    bus$.push({type: NEW_PLAYER});
  },

  render: function() {
    return(
      <Players scores={this.state.scores} />
    );
  }
});
