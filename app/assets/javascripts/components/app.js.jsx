NEW_PLAYER = 'NEW_PLAYER';
RESET = 'RESET';
SCORE_CHANGED = 'SCORE_CHANGED';
NEW_SCORE = 'NEW_SCORE';

Name = React.createClass({
  getInitialState: function() {
    return {name: 'Jugador ' + (this.props.playerId + 1)};
  },

  setName: function(event) {
    var value = prompt('Introduce el nombre', this.state.name);
    if (!value) {
      return;
    }
    value = value.trim();
    if (value.length > 0) {
      this.setState({name: value});
    }
  },

  render: function() {
    return(
      <h3 onClick={this.setName} className="actionable text-xs-center">{this.state.name}</h3>
    );
  }
});

Score = React.createClass({
  getInitialState: function() {
    return {value: this.props.value};
  },

  change: function() {
    var value = parseInt(prompt('Introduce una nueva puntuación'));
    if (value) {
      this.setState({value: value});
      bus$.push({type: SCORE_CHANGED, playerId: this.props.playerId, value: value, index: this.props.index});
    }
  },

  render: function() {
    return(
      <tr>
        <td onClick={this.change} className="golden actionable">{this.state.value}</td>
      </tr>
    );
  }
});

MinusTen = function(props) {
  var send = function() {
    bus$.push({type: NEW_SCORE, playerId: props.playerId, value: -10});
  };

  return(
    <div className="col-xs-6">
      <button type="button" onClick={send} className="btn btn-primary">
        Anotar<br />
        -10
      </button>
    </div>
  );
};

NewScore = function(props) {
  var change = function() {
    var value = parseInt(prompt('Introduce la puntuación'));
    if (!isNaN(value)) {
      bus$.push({type: NEW_SCORE, playerId: props.playerId, value: value});
    }
  };

  return(
    <div className="col-xs-6">
      <button type="button" onClick={change} className="btn btn-primary">
        Anotar<br />
        puntos
      </button>
    </div>
  );
};

Player = function(props) {
  var scores = props.scores.map(function(value, index) {
    return <Score value={value} key={index} index={index} playerId={props.playerId} />;
  });

  return(
    <div className="col-xs-2">
      <h4 className="text-xs-center">{props.position + 1}º</h4>
      <Name playerId={props.playerId} />
      <table className="table">
        <tbody>
          {scores}
          <tr>
            <td>Total: <span className="golden">{props.total}</span></td>
          </tr>
        </tbody>
      </table>
      <form className="row">
        <NewScore playerId={props.playerId} />
        <MinusTen playerId={props.playerId} />
      </form>
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
    players.push(<Player key={i} playerId={i} scores={scores} total={getTotal(scores)} position={getPosition(i)} />);
  }

  return(
    <div>
      <nav className="navbar">
        <span onClick={newPlayer} className="navbar-brand actionable">+ añadir jugador</span>
        <span onClick={reset} className="navbar-brand pull-xs-right actionable">⟲ reiniciar marcadores</span>
      </nav>
      <div className="row">
        {players}
      </div>
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
