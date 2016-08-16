import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';

export default function(props) {
  var change = function() {
    var value = parseInt(prompt('Introduce la puntuación'));
    if (!isNaN(value)) {
      bus$.push({type: NEW_SCORE, playerId: props.playerId, value: value});
    }
  };

  return(
    <div className="m-b-1">
      <button type="button" onClick={change} className="btn btn-primary">
        Anotar puntos
      </button>
    </div>
  );
};
