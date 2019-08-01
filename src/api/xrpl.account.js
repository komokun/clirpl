const R = require('ramda');
const EventEmitter = require('events');

class LedgerAccount extends EventEmitter {

   constructor(set) {

      super();

      // Connections
      this._ws       = set.ws;
      this._vault    = set.vault;
   }
}

module.exports = LedgerAccount;