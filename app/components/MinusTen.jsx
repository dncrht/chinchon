import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';

export default function(props) {
  var send = function() {
    bus$.push({type: NEW_SCORE, playerId: props.playerId, value: -10});
  };

  return(
    <div>
      <button type="button" onClick={send} className="btn btn-primary">
        Anotar -10
      </button>
    </div>
  );
};
