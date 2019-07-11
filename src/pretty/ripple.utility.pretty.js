var Table = require('cli-table3');
var colors = require('colors');

var _ = require('lodash');

export const RippleUtilityPretty = {

   ping: (info) => {
      
      var t = new Table({
            head: ['Found']
         , style: {  head: ['green'] }
         , colWidths: [38 ] 
      });

      console.log(t.toString());
   },

   random: (number) => {
      var t = new Table({
            head: [ number ]
         , style: {  head: ['blue'] }
         //, colWidths: [38 ] 
      });
      
      console.log(t.toString());
   }
}