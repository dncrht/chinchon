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
    <div className="col-xs-6">
      <button type="button" onClick={change} className="btn btn-primary">
        Anotar<br />
        puntos
      </button>
    </div>
  );
};
