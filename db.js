/**
* User Model Info
* 1.  A user has many wallets
* 2.  A user has basic descriptice info.
**/

const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'dev',
    password: 'password',
    database: 'users_service'
  }
});

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }
}

module.exports = {
  User
}
