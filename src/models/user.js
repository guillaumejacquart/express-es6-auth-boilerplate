'use strict';

/**
* User Model
******************** */

class User {

	constructor(db) {
		this.db = db;
	}
  
	find(username, callback) {
		this.db.findOne({
			username: username
		}, function(err, doc){
			if(err){
				return callback(err);
			}
			
			return callback(null, doc);
		})
	}
  
	isValid(username, password, callback) {
		this.db.findOne({
			username: username,
			password: password
		}, function(err, doc){
			if(err){
				return callback(err);
			}
			
			return callback(null, typeof(doc) !== 'undefined');
		})
	}
  
}

module.exports = User;