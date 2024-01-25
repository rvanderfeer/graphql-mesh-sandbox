db = db.getSiblingDB('MongoDB_database');

db.createUser(
{
    user: "MongoDB_username",
    pwd: "MongoDB_password",
    roles: [
      { role: "readWrite", db: "MongoDB_database" }
    ]
});

db.createCollection('enterprise');

db.enterprise.insertMany([
 {
    AGBCode: '01051111',
    Name: '1st Organisation',
    TradeName: '1st ORGANISATION Ltd'
  },
 {
    AGBCode: '01052222',
    Name: '2nd Organisation',
    TradeName: '2nd ORGANISATION NV'
  },
 {
    AGBCode: '01053333',
    Name: '3rd Organisation',
    TradeName: '3rd ORGANISATION BV'
  },
 {
    AGBCode: '01054444',
    Name: '4th Organisation',
    TradeName: '4th ORGANISATION Ltd'
  },
 {
    AGBCode: '01055555',
    Name: '5th Organisation',
    TradeName: '5th ORGANISATION GmbH'
  },
 {
    AGBCode: '01056666',
    Name: '6th Organisation',
    TradeName: '6th ORGANISATION Inc'
  }
]);

db.enterprise.createIndex({ AGBCode: 1 }, { unique: true });
