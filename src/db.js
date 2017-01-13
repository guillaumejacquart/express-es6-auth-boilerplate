import nedb from 'nedb';

export default callback => {
	
	let db = new nedb({ filename: './data.db', autoload: true });
  
	// connect to a database if needed, then pass it to `callback`:
	callback(db);
}