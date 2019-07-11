var Table = require('cli-table3');
var colors = require('colors');

var _ = require('lodash');

export const RippleServerInfoPretty = {

   fee: (info) => {

      var t = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
      
      t.push(
         {'Current Ledger Size ' : [info.current_ledger_size] },
         {'Expected Ledger Size ' : [info.expected_ledger_size] },

         {'Base Fee (drops) ' : [info.drops.base_fee] },
         {'Median Fee (drops) ' : [info.drops.median_fee] },
         {'Minimum Fee (drops) ' : [info.drops.minimum_fee] },
         {'Open Ledger Fee (drops) ' : [info.drops.open_ledger_fee] },

         {'Median Level ' : [info.levels.median_level] },
         {'Minimum Level ' : [info.levels.minimum_level] },
      );
      console.log(t.toString());
   },

   info: (info) => {

      var t = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
      
      t.push(
         {'Build Version ' : [info.build_version] },
         {'Public Key Node ' : [info.pubkey_node] },
         {'Completed Ledgers ' : [info.complete_ledgers] },
         {'Server State ' : [info.server_state] },
         {'Time ' : [info.time] },
         {'Validation Ledger Age ' : [info.validated_ledger.age] },
         {'Validation Quorum ' : [info.validation_quorum] },
      );
      console.log(t.toString());
   },

   state: (number) => {
      var t = new Table({
            head: [ number ]
         , style: {  head: ['blue'] }
         //, colWidths: [38 ] 
      });
      
      console.log(t.toString());
   }
}