'use strict';

exports.feedsFeedIdDataGet = function(feedId) {

  var examples = {};
  
  examples['application/json'] = [ {
  "position" : "aeiou",
  "lon" : 1.3579000000000001069366817318950779736042022705078125,
  "completed_at" : "aeiou",
  "created_epoch" : 1.3579000000000001069366817318950779736042022705078125,
  "expiration" : "aeiou",
  "group_id" : 1.3579000000000001069366817318950779736042022705078125,
  "feed_id" : 1.3579000000000001069366817318950779736042022705078125,
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "updated_at" : "aeiou",
  "value" : "aeiou",
  "created_at" : "aeiou",
  "lat" : 1.3579000000000001069366817318950779736042022705078125,
  "ele" : 1.3579000000000001069366817318950779736042022705078125
} ];
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
exports.getDataById = function(feedId, dataId) {

  var examples = {};
  
  examples['application/json'] = "{}";
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
