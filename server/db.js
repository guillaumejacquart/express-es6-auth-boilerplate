import nedb from 'nedb';

export default callback => {
	
	let db = {};
	db.users = new nedb({ filename: './users.db', autoload: true });
  
	// connect to a database if needed, then pass it to `callback`:
	callback(db);
}