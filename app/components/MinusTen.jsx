import React from 'react';
import {NEW_SCORE, bus$} from './bus.js';
import {translate} from 'react-i18next';

const MinusTen = function(props) {
  const {t} = props;

  var send = function() {
    bus$.push({type: NEW_SCORE, playerId: props.playerId, value: -10});
  };

  return(
    <div>
      <button type="button" onClick={send} className="btn btn-primary">
        {t('add_minus_ten')}
      </button>
    </div>
  );
};

export default translate(null, {wait: true})(MinusTen);
