#!/usr/bin/env coffee

< (reply)=>
  begin = new Date
  (txt)=>
    reply(txt+'\n耗时: '+Math.round((new Date - begin)/6e3/10)+'分钟')
