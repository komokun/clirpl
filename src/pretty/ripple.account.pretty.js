import { table, getBorderCharacters } from 'table';

var Table = require('cli-table3');
var _ = require('lodash');

const chalk = require('chalk');

export const RippleAccountPretty = {

   balances: (info) => {
      const _data = [
         ['Currency ', info[0].currency],
         ['Value ', info[0].value],
      ];

      console.log(table(_data, config));
   },

   info: (info) => {

      var t = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
      
      t.push(
         {'Account ' : [info.Account] },
         {'XRP Balance ' : [(info.Balance / 1000000)] },
         {'Sequence ' : [info.Sequence] },
         {'Owner Count ' : [info.OwnerCount] },
         {'Previous Effective Transaction ' : [info.PreviousTxnID] },
         {'Ledger Entry Type ' : [info.LedgerEntryType] },
      );
      console.log(t.toString());
   },

   transactions: (info) => {

      var t = new Table({
            head: ['From', 'Destination', 'Tag', 'Amount', 'Fee', 'Date']
         , style: {  head: ['blue'] }
         , colWidths: [38, 38, 8, 10, 10, 15]  //set the widths of each column (optional)
      });

      _.forEach(info, (i) => {
         t.push(
            [i.Account, i.Destination, i.DestinationTag, (i.Amount / 1000000), i.Fee, i.date]
         );
      })
      console.log(t.toString());
   }
};