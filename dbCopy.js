// Original Source: https://gist.github.com/RandomEtc/1219665

const env = require('./env.js');
const url = require('url');
const { MongoClient } = require('mongodb');

const { sourceDatabaseUrl, targetDatabaseUrl } = require('./env.js');

let collections = [];

async function openDbFromUrl(mongoUrl) {
  return new Promise(function(resolve, reject) {
    var dbUrl = url.parse(mongoUrl),
      dbName = dbUrl.pathname.slice(1), // no slash
      client = new MongoClient(mongoUrl);
    client.connect().then(async function (_client) {
      resolve(_client);
    }).catch(function (err) {
      reject(err);
    });
  });
}

function copyCollection(source, target, collectionName) {
  let sourceCollection = source.db(source.topology.s.options.dbName).collection(collectionName);
  let targetCollection = target.db(target.topology.s.options.dbName).collection(collectionName);
  return new Promise(async function(resolve, reject) {
    sourceCollection.find().toArray(async function(err3, results) {
      if (err3) {
        console.error("error finding source results");
        reject(err3);
      }
      else if ((await target.db(target.topology.s.options.dbName).listCollections().toArray()).some((e) => e.name === collectionName) && !collections.includes(targetCollection.namespace)) {
        collections.push(targetCollection.namespace);
        targetCollection.drop(function(err) {
        if (err) throw err;
         targetCollection.insertMany(results, { safe: true }, function(err4, docs) {
           if (err4) {
             console.error("error inserting target results");
             reject(err4);
           }
           else {
             console.log(`${docs.insertedCount} doc(s) inserted into collection: ${targetCollection.namespace}`);
             resolve();
           }
         });
        });
      } else {
        resolve();
      }
    });
  });
}

module.exports = async function () {
  collections = [];
  let source = (await openDbFromUrl(sourceDatabaseUrl));
  let target = (await openDbFromUrl(targetDatabaseUrl));
  if (target && source) {
    let collectionNames = (await source.db(source.topology.s.options.dbName).listCollections().toArray()).map((e) => e.name);
    for (let i = 0; i < collectionNames.length; i++) {
      await copyCollection(source, target, collectionNames[i]);
    }
    console.log("Import completed");
  }
};
