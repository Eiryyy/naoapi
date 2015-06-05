var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var _ = require('underscore');
var dynamo = new aws.DynamoDB( {
  accessKeyId: process.env.dynamoAccessKeyId,
  secretAccessKey: process.env.dynamoSecretAccessKey,
  region: process.env.dynamoRegion
} );

router.get('/nao', function(req, res) {
  dynamo.scan( {
    TableName: 'nao',
    Select: 'ALL_ATTRIBUTES',
  }, function (err, data) {
    if (err) return res.send(err);
    var d = _.sample(data.Items);
    var bucket = d.bucket.S;
    var key = d.key.S;
    var url = 'https://s3.amazonaws.com/' + bucket + '/' + key;
    res.json( {
      bucket: bucket,
      key: key,
      url: url
    } );
  } );
} );
module.exports = router;
