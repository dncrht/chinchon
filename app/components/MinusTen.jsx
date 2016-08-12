import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';

export default function(props) {
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
