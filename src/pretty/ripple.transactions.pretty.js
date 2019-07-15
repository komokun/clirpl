var Table = require('cli-table3');
var _ = require('lodash');

export const RippleTransactionPretty = {

   balances: (info) => {
      const _data = [
         ['Currency ', info[0].currency],
         ['Value ', info[0].value],
      ];

      console.log(table(_data, config));
   },
}