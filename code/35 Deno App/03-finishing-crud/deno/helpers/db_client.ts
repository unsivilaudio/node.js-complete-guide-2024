import {
    Database,
    MongoClient,
} from 'https://deno.land/x/mongo@v0.33.0/mod.ts';

let db: Database;

export async function connect() {
    const client = new MongoClient();
    /**
     *  REPLACE CONNECTION STRING IF USING ATLAS
     *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
     *  ==================
     *  AWAIT connect TO DATABASEE
     */
    await client.connect(
        'mongodb://127.0.0.1:27017/test?retryWrites=true&authSource=admin'
    );

    db = client.database('todos-app');
}

export function getDb(): Database {
    if (!db) {
        throw new Error('DB not initialized!');
    }
    return db;
}
