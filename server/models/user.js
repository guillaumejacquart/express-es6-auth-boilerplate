'use strict';
import bcrypt from 'bcrypt-nodejs';

/**
* User Model
******************** */

class User {

	constructor(db) {
		this.db = db.users;
	}
	
	create(username, password, options, callback){
		bcrypt.genSalt(10, (err, result) => {
			if(err) { throw err; }
			
			var salt = result;
			bcrypt.hash(password, result, null, (err, hash) => {
				if(err) { throw err; }
				
				var user = options;
				user.username = username;
				user.password = hash;
				user.salt = salt;
				
				this.db.insert(user, callback)
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
	
	findOne(options, callback){
		this.db.findOne(options, callback)
	}  
}

module.exports = User;