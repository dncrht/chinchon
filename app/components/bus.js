export const NEW_PLAYER = 'NEW_PLAYER';
export const RESET = 'RESET';
export const SCORE_CHANGED = 'SCORE_CHANGED';
export const NEW_SCORE = 'NEW_SCORE';

export const bus$ = function() {
  var subscribers = [];
  return {
    push: function(action) {
      subscribers.every(function(callback) {callback(action)});
    },

    onValue: function(callback) {
      subscribers.push(callback);
    }
  };
}();
