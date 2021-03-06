import React from 'react';
import Player from './Player.jsx';
import {NEW_PLAYER, RESET, bus$} from './bus.js';
import {translate} from 'react-i18next';

if (typeof Object.values != 'function') {
  Object.values = function(target) {
    return Object.keys(target).map(function(k) {return target[k];})
  }
}

const Players = function(props) {
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

  const {t} = props;

  return(
    <div>
      <nav className="navbar m-b-1">
        <span onClick={newPlayer} className="navbar-brand actionable">{t('new_player')}</span>
        <span onClick={reset} className="navbar-brand pull-xs-right actionable">{t('reset_scores')}</span>
      </nav>
      <div className="row">
        {players}
      </div>
    </div>
  );
};

export default translate(null, {wait: true})(Players);
