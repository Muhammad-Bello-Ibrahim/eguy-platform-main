const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Muhammad:OraoWorks@cluster0.dwm4hnu.mongodb.net/eguy?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function debug() {
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Connected.");
        const db = client.db("eguy");

        console.log("Listing collections:");
        const collections = await db.listCollections().toArray();
        collections.forEach(c => console.log(` - ${c.name}`));

        console.log("\nCounting documents in 'dataplans':");
        const count = await db.collection("dataplans").countDocuments();
        console.log(`Count: ${count}`);

        console.log("\nCounting documents in 'airtime_plans':");
        const acount = await db.collection("airtime_plans").countDocuments();
        console.log(`Count: ${acount}`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

debug();
