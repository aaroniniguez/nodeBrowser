import dotenv from 'dotenv'
dotenv.config({ path: '/Users/aaroniniguez/AutoPromote/.env'})

interface DBConfig {
	host: string; 
	user: string;
	database: string;
	password: string;
	charset: string;
}
import mysql, { RowDataPacket } from "mysql"
import Connection from "mysql/lib/Connection";
export default class Database {
	dbConfig: DBConfig;
	connection: Connection;
	constructor(database = "stock") {
		this.dbConfig = {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			database: database,
			password: process.env.DB_PASS,
			charset: 'utf8mb4'
		};
		
		this.connection = mysql.createConnection(this.dbConfig);
		this.connection.connect(function(err) {
			if (err) {
				throw console.error('Could not connect to Mysql Server: ' + err.message);
			}
			console.log('Connected to the MySQL server.');
		});
	}

	//this is when you want to stop the connection between your app and the mysql server..so only when your app is stopped...
	disconnect() {
		this.connection.end();
	}

	query(sql: string): Promise<RowDataPacket[]>{
		return new Promise<RowDataPacket[]>((resolve, reject) => {
			this.connection.query<RowDataPacket[]>(sql, (err, rows)=> {
				if(err) {
					if(err.code === "PROTOCOL_CONNECTION_LOST") {
						(async () => {
							setTimeout(() => {
								this.connection = mysql.createConnection(this.dbConfig);
								this.query(sql);
							}, 10000);
						})();
					}
					else if (err.code === "ER_DUP_ENTRY") {
						reject(err);
					} else {
						console.log(err);
						this.disconnect();
					}
				}
				resolve(rows);
			});
		})
	}

}