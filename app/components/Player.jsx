import React from 'react';
import Name from './Name.jsx';
import Score from './Score.jsx';
import MinusTen from './MinusTen.jsx';
import NewScore from './NewScore.jsx';

export default function(props) {
  var scores = props.scores.map(function(value, index) {
    return <Score value={value} key={index} index={index} playerId={props.playerId} />;
  });

  var position = props.position + 1;
  var leader = (position == 1) ? '🏆' : null;

  var total;
  if (props.scores.length > 0) {
    total = <tr><td>Total: <span className="golden p-r-1">{props.total}</span></td></tr>;
  }

  return(
    <div className="col-xs-3">
      <h4 className="text-xs-center">{position}º {leader}</h4>
      <Name playerId={props.playerId} />
      <table className="table">
        <tbody>
          {scores}
          {total}
        </tbody>
      </table>
      <div className="text-xs-center">
        <NewScore playerId={props.playerId} />
        <MinusTen playerId={props.playerId} />
      </div>
    </div>
  );
};
