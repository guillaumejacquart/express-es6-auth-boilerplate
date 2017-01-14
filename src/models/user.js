'use strict';
import bcrypt from 'bcrypt-nodejs';

/**
* User Model
******************** */

class User {

	constructor(db) {
		this.db = db.users;
	}
	
	create(username, password, callback){
		bcrypt.genSalt(10, (err, result) => {
			var salt = result;
			bcrypt.hash(password, result, null, (err, hash) => {
				this.db.insert({
					username: username,
					password: hash,
					salt: salt
				}, callback)
			});
		});
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
  
	findById(id, callback) {
		this.db.findOne({
			_id: id
		}, function(err, doc){
			if(err){
				return callback(err);
			}
			
			return callback(null, doc);
		})
	}
  
	isValid(username, password, callback) {
		this.db.findOne({
			username: username
		}, function(err, doc){
			if(err){
				return callback(err);
			}
			
			bcrypt.compare(password, doc.password, function(err, res) {
				return callback(err, res);
			});
			
		})
	}
  
}

module.exports = User;