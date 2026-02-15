const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Muhammad:OraoWorks@cluster0.dwm4hnu.mongodb.net/eguy?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const dataPlans = [
    // GLO Data Plans
    { network: 'GLO', dataBundle: '200MB', dataPlan: '104', duration: '14 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 55, price: 60 },
    { network: 'GLO', dataBundle: '500MB', dataPlan: '202', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 56, price: 61 },
    { network: 'GLO', dataBundle: '1GB', dataPlan: '399', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 57, price: 62 },
    { network: 'GLO', dataBundle: '2GB', dataPlan: '798', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 58, price: 63 },
    { network: 'GLO', dataBundle: '3GB', dataPlan: '1197', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 59, price: 64 },
    { network: 'GLO', dataBundle: '5GB', dataPlan: '1995', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 60, price: 65 },
    { network: 'GLO', dataBundle: '10GB', dataPlan: '3990', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 61, price: 66 },
    { network: 'GLO', dataBundle: '750MB', dataPlan: '194', duration: '1 Day', type: 'SME', status: 'Active', apiPrice: 114, price: 119 },
    { network: 'GLO', dataBundle: '1.5GB', dataPlan: '288', duration: '1 Day', type: 'SME', status: 'Active', apiPrice: 115, price: 120 },
    { network: 'GLO', dataBundle: '2.5GB', dataPlan: '479', duration: '2 Days', type: 'SME', status: 'Active', apiPrice: 116, price: 121 },
    { network: 'GLO', dataBundle: '10.0GB', dataPlan: '1870', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 117, price: 122 },
    { network: 'GLO', dataBundle: '1GB', dataPlan: '283', duration: '3 Days', type: 'SME', status: 'Active', apiPrice: 138, price: 143 },
    { network: 'GLO', dataBundle: '1GB', dataPlan: '328', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 139, price: 144 },
    { network: 'GLO', dataBundle: '3GB', dataPlan: '837', duration: '3 Days', type: 'SME', status: 'Active', apiPrice: 140, price: 145 },
    { network: 'GLO', dataBundle: '3GB', dataPlan: '968', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 141, price: 146 },
    { network: 'GLO', dataBundle: '5GB', dataPlan: '1630', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 142, price: 147 },

    // 9MOBILE Data Plans
    { network: '9MOBILE', dataBundle: '500MB', dataPlan: '171', duration: '7 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 34, price: 39 },
    { network: '9MOBILE', dataBundle: '1.5GB', dataPlan: '885', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 35, price: 40 },
    { network: '9MOBILE', dataBundle: '2GB', dataPlan: '1075', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 36, price: 41 },
    { network: '9MOBILE', dataBundle: '3GB', dataPlan: '1285', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 37, price: 42 },
    { network: '9MOBILE', dataBundle: '4.5GB', dataPlan: '1760', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 38, price: 43 },
    { network: '9MOBILE', dataBundle: '1GB', dataPlan: '340', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 39, price: 44 },
    { network: '9MOBILE', dataBundle: '5GB', dataPlan: '1700', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 40, price: 45 },
    { network: '9MOBILE', dataBundle: '1.5GB', dataPlan: '515', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 41, price: 46 },
    { network: '9MOBILE', dataBundle: '2GB', dataPlan: '680', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 42, price: 47 },
    { network: '9MOBILE', dataBundle: '3.0GB', dataPlan: '1020', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 62, price: 67 },
    { network: '9MOBILE', dataBundle: '10.0GB', dataPlan: '3440', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 63, price: 68 },
    { network: '9MOBILE', dataBundle: '500.0MB', dataPlan: '171', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 64, price: 69 },

    // AIRTEL Data Plans
    { network: 'AIRTEL', dataBundle: '100.0MB', dataPlan: '103', duration: '7 Days', type: 'SME', status: 'Inactive', apiPrice: 16, price: 21 },
    { network: 'AIRTEL', dataBundle: '300.0MB', dataPlan: '303', duration: '7 Days', type: 'SME', status: 'Inactive', apiPrice: 17, price: 22 },
    { network: 'AIRTEL', dataBundle: '500.0MB', dataPlan: '500', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 18, price: 23 },
    { network: 'AIRTEL', dataBundle: '1.0GB', dataPlan: '994', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 19, price: 24 },
    { network: 'AIRTEL', dataBundle: '2.0GB', dataPlan: '1224', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 20, price: 25 },
    { network: 'AIRTEL', dataBundle: '5.0GB', dataPlan: '3060', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 21, price: 26 },
    { network: 'AIRTEL', dataBundle: '10.0GB', dataPlan: '6120', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 22, price: 27 },
    { network: 'AIRTEL', dataBundle: '15.0GB', dataPlan: '9180', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 23, price: 28 },
    { network: 'AIRTEL', dataBundle: '20.0GB', dataPlan: '12240', duration: '30 Days', type: 'SME', status: 'Inactive', apiPrice: 24, price: 29 },
    { network: 'AIRTEL', dataBundle: '100MB', dataPlan: '109', duration: '7 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 26, price: 31 },
    { network: 'AIRTEL', dataBundle: '300MB', dataPlan: '291', duration: '7 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 27, price: 32 },
    { network: 'AIRTEL', dataBundle: '500MB', dataPlan: '470', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 28, price: 33 },
    { network: 'AIRTEL', dataBundle: '1GB', dataPlan: '971', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 29, price: 34 },
    { network: 'AIRTEL', dataBundle: '2GB', dataPlan: '1942', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 30, price: 35 },
    { network: 'AIRTEL', dataBundle: '5GB', dataPlan: '4855', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 31, price: 36 },
    { network: 'AIRTEL', dataBundle: '15GB', dataPlan: '11850', duration: 'MONTHLY', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 32, price: 37 },
    { network: 'AIRTEL', dataBundle: '20GB', dataPlan: '15220', duration: 'MONTHLY', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 33, price: 38 },
    { network: 'AIRTEL', dataBundle: '10GB', dataPlan: '9710', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 54, price: 59 },
    { network: 'AIRTEL', dataBundle: '500MB', dataPlan: '495', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 65, price: 70 },
    { network: 'AIRTEL', dataBundle: '1.5GB', dataPlan: '977', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 66, price: 71 },
    { network: 'AIRTEL', dataBundle: '3.5GB', dataPlan: '1470', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 67, price: 72 },
    { network: 'AIRTEL', dataBundle: '3GB', dataPlan: '1949', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 68, price: 73 },
    { network: 'AIRTEL', dataBundle: '4GB', dataPlan: '2445', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 69, price: 74 },
    { network: 'AIRTEL', dataBundle: '8GB', dataPlan: '2935', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 70, price: 75 },
    { network: 'AIRTEL', dataBundle: '10GB', dataPlan: '3894', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 71, price: 76 },
    { network: 'AIRTEL', dataBundle: '18GB', dataPlan: '5800', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 72, price: 77 },
    { network: 'AIRTEL', dataBundle: '40GB', dataPlan: '9857', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 73, price: 78 },
    { network: 'AIRTEL', dataBundle: '6GB', dataPlan: '2444', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 74, price: 79 },
    { network: 'AIRTEL', dataBundle: '1GB', dataPlan: '782', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 75, price: 80 },
    { network: 'AIRTEL', dataBundle: '150MB', dataPlan: '67', duration: '2 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 103, price: 108 },
    { network: 'AIRTEL', dataBundle: '300MB', dataPlan: '125', duration: '2 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 104, price: 109 },
    { network: 'AIRTEL', dataBundle: '1GB', dataPlan: '843', duration: '7 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 105, price: 110 },
    { network: 'AIRTEL', dataBundle: '1.5GB', dataPlan: '518', duration: '2 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 107, price: 112 },
    { network: 'AIRTEL', dataBundle: '600MB', dataPlan: '258', duration: '1 Day', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 108, price: 113 },
    { network: 'AIRTEL', dataBundle: '1GB', dataPlan: '343', duration: '1 Day', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 109, price: 114 },
    { network: 'AIRTEL', dataBundle: '1.5GB', dataPlan: '415', duration: '1 Day', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 110, price: 115 },
    { network: 'AIRTEL', dataBundle: '3GB', dataPlan: '785', duration: '2 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 111, price: 116 },
    { network: 'AIRTEL', dataBundle: '3.5GB', dataPlan: '1515', duration: '7 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 106, price: 111 },
    { network: 'AIRTEL', dataBundle: '7GB', dataPlan: '2100', duration: '7 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 112, price: 117 },
    { network: 'AIRTEL', dataBundle: '10GB', dataPlan: '3105', duration: '30 Days', type: 'AWOOF GIFTING', status: 'Active', apiPrice: 113, price: 118 },
    { network: 'AIRTEL', dataBundle: '10GB', dataPlan: '2932', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 120, price: 125 },
    { network: 'AIRTEL', dataBundle: '18.0GB', dataPlan: '4885', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 121, price: 126 },
    { network: 'AIRTEL', dataBundle: '2GB', dataPlan: '1464', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 124, price: 129 },
    { network: 'AIRTEL', dataBundle: '13GB', dataPlan: '4887', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 125, price: 130 },
    { network: 'AIRTEL', dataBundle: '25GB', dataPlan: '7830', duration: '30 Days', type: 'GIFTING', status: 'Inactive', apiPrice: 126, price: 131 },
    { network: 'AIRTEL', dataBundle: '35GB', dataPlan: '9800', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 127, price: 132 },
    { network: 'AIRTEL', dataBundle: '60GB', dataPlan: '14680', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 128, price: 133 },

    // MTN Data Plans
    { network: 'MTN', dataBundle: '500MB', dataPlan: '341', duration: '1 Day', type: 'SME2', status: 'Active', apiPrice: 135, price: 140 },
    { network: 'MTN', dataBundle: '1GB', dataPlan: '620', duration: '30 Days', type: 'SME2', status: 'Active', apiPrice: 1, price: 6 },
    { network: 'MTN', dataBundle: '2GB', dataPlan: '1130', duration: '30 Days', type: 'SME2', status: 'Active', apiPrice: 2, price: 7 },
    { network: 'MTN', dataBundle: '3GB', dataPlan: '1640', duration: '30 Days', type: 'SME2', status: 'Active', apiPrice: 3, price: 8 },
    { network: 'MTN', dataBundle: '5GB', dataPlan: '2250', duration: '30 Days', type: 'SME2', status: 'Active', apiPrice: 4, price: 9 },
    { network: 'MTN', dataBundle: '500MB', dataPlan: '409', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 137, price: 142 },
    { network: 'MTN', dataBundle: '1GB', dataPlan: '530', duration: '7 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 138, price: 143 },
    { network: 'MTN', dataBundle: '2GB', dataPlan: '1336', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 6, price: 11 },
    { network: 'MTN', dataBundle: '3GB', dataPlan: '1984', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 7, price: 12 },
    { network: 'MTN', dataBundle: '5GB', dataPlan: '2760', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', apiPrice: 8, price: 13 },
    { network: 'MTN', dataBundle: '500MB', dataPlan: '485', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 9, price: 14 },
    { network: 'MTN', dataBundle: '1GB', dataPlan: '776', duration: '7 Days', type: 'SME', status: 'Active', apiPrice: 10, price: 15 },
    { network: 'MTN', dataBundle: '2GB', dataPlan: '1458', duration: '30 Days', type: 'SME', status: 'Active', apiPrice: 11, price: 16 },
    { network: 'MTN', dataBundle: '3GB', dataPlan: '1915', duration: '30 Days', type: 'SME', status: 'Active', apiPrice: 12, price: 17 },
    { network: 'MTN', dataBundle: '3.5GB', dataPlan: '2420', duration: '30 Days', type: 'SME', status: 'Active', apiPrice: 13, price: 18 },
    { network: 'MTN', dataBundle: '5GB', dataPlan: '2530', duration: '30 Days', type: 'SME', status: 'Active', apiPrice: 14, price: 19 },
    { network: 'MTN', dataBundle: '10GB', dataPlan: '4355', duration: '30 Days', type: 'SME', status: 'Active', apiPrice: 15, price: 20 },
    { network: 'MTN', dataBundle: '2GB', dataPlan: '1458', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 25, price: 30 },
    { network: 'MTN', dataBundle: '500MB', dataPlan: '428', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Inactive', apiPrice: 43, price: 48 },
    { network: 'MTN', dataBundle: '1.12GB', dataPlan: '1458', duration: '(30 Days)+N335 free airtime', type: 'DATA AWOOF', status: 'Active', apiPrice: 44, price: 49 },
    { network: 'MTN', dataBundle: '2.5GB', dataPlan: '739', duration: '1 Day', type: 'DATA AWOOF', status: 'Active', apiPrice: 45, price: 50 },
    { network: 'MTN', dataBundle: '1GB', dataPlan: '485', duration: '1 Day', type: 'DATA AWOOF', status: 'Active', apiPrice: 85, price: 90 },
    { network: 'MTN', dataBundle: '1.5GB', dataPlan: '582', duration: '2 Days', type: 'DATA AWOOF', status: 'Active', apiPrice: 86, price: 91 },
    { network: 'MTN', dataBundle: '3.2GB', dataPlan: '969', duration: '2 Days', type: 'DATA AWOOF', status: 'Active', apiPrice: 87, price: 92 },
    { network: 'MTN', dataBundle: '75MB', dataPlan: '75', duration: '1 Day', type: 'GIFTING', status: 'Active', apiPrice: 88, price: 93 },
    { network: 'MTN', dataBundle: '110MB', dataPlan: '99', duration: '1 Day', type: 'GIFTING', status: 'Active', apiPrice: 89, price: 94 },
    { network: 'MTN', dataBundle: '230MB', dataPlan: '196', duration: '1 Day', type: 'GIFTING', status: 'Active', apiPrice: 90, price: 95 },
    { network: 'MTN', dataBundle: '36GB', dataPlan: '10585', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 91, price: 96 },
    { network: 'MTN', dataBundle: '750MB', dataPlan: '437', duration: '3 Days', type: 'GIFTING', status: 'Active', apiPrice: 92, price: 97 },
    { network: 'MTN', dataBundle: '1.5GB', dataPlan: '582', duration: '2 Days', type: 'GIFTING', status: 'Active', apiPrice: 93, price: 98 },
    { network: 'MTN', dataBundle: '2.5GB', dataPlan: '871', duration: '2 Days', type: 'GIFTING', status: 'Active', apiPrice: 94, price: 99 },
    { network: 'MTN', dataBundle: '1.5GB', dataPlan: '968', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 95, price: 100 },
    { network: 'MTN', dataBundle: '2GB', dataPlan: '727', duration: '2 Days', type: 'GIFTING', status: 'Active', apiPrice: 96, price: 101 },
    { network: 'MTN', dataBundle: '2.7GB', dataPlan: '1934', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 97, price: 102 },
    { network: 'MTN', dataBundle: '25GB', dataPlan: '8690', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 98, price: 103 },
    { network: 'MTN', dataBundle: '1.2GB', dataPlan: '727', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 99, price: 104 },
    { network: 'MTN', dataBundle: '12.5GB', dataPlan: '5313', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 100, price: 105 },
    { network: 'MTN', dataBundle: '20GB', dataPlan: '7250', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 101, price: 106 },
    { network: 'MTN', dataBundle: '16.5GB', dataPlan: '6279', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 102, price: 107 },
    { network: 'MTN', dataBundle: '20GB', dataPlan: '4927', duration: '7 Days', type: 'DATA AWOOF', status: 'Active', apiPrice: 118, price: 123 },
    { network: 'MTN', dataBundle: '7GB', dataPlan: '3382', duration: '30 Days', type: 'DATA AWOOF', status: 'Active', apiPrice: 119, price: 124 },
    { network: 'MTN', dataBundle: '5GB', dataPlan: '2900', duration: '30 Days+N868 free airtime', type: 'DATA AWOOF', status: 'Active', apiPrice: 136, price: 141 },
    { network: 'MTN', dataBundle: '6GB', dataPlan: '2417', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 122, price: 127 },
    { network: 'MTN', dataBundle: '3.5GB', dataPlan: '1458', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 123, price: 128 },
    { network: 'MTN', dataBundle: '11GB', dataPlan: '3384', duration: '7 Days', type: 'GIFTING', status: 'Active', apiPrice: 129, price: 134 },
    { network: 'MTN', dataBundle: '75GB', dataPlan: '17385', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 130, price: 135 },
    { network: 'MTN', dataBundle: '165GB', dataPlan: '33810', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 131, price: 136 },
    { network: 'MTN', dataBundle: '250GB', dataPlan: '53105', duration: '30 Days', type: 'GIFTING', status: 'Active', apiPrice: 132, price: 137 },
    { network: 'MTN', dataBundle: '150GB', dataPlan: '38650', duration: '60 Days', type: 'GIFTING', status: 'Active', apiPrice: 133, price: 138 },
    { network: 'MTN', dataBundle: '480GB', dataPlan: '86910', duration: '90 Days', type: 'GIFTING', status: 'Active', apiPrice: 134, price: 139 },
];

const airtimeDiscounts = {
    MTN: 0.02,
    GLO: 0.055,
    '9MOBILE': 0.04,
    AIRTEL: 0.02,
};

const airtimeDenominations = [50, 100, 200, 500, 1000, 2000, 5000];

async function seed() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db("eguy");

        // Seed Data Plans
        const dataPlansCollection = db.collection("dataplans"); // Mongoose typically lowercases and pluralizes 'DataPlan' -> 'dataplans'
        await dataPlansCollection.deleteMany({});

        // Add createdAt/updatedAt
        const now = new Date();
        const dataPlansWithDates = dataPlans.map(p => ({ ...p, createdAt: now, updatedAt: now }));

        await dataPlansCollection.insertMany(dataPlansWithDates);
        console.log(`Seeded ${dataPlans.length} data plans`);

        // Seed Airtime Plans
        const airtimePlansCollection = db.collection("airtime_plans");
        await airtimePlansCollection.deleteMany({});

        const airtimePlans = [];
        for (const network of Object.keys(airtimeDiscounts)) {
            const discount = airtimeDiscounts[network];
            for (const amount of airtimeDenominations) {
                const apiPrice = amount - (amount * discount);
                const price = amount;
                airtimePlans.push({
                    network,
                    amount,
                    price,
                    apiPrice,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await airtimePlansCollection.insertMany(airtimePlans);
        console.log(`Seeded ${airtimePlans.length} airtime plans`);

    } catch (err) {
        console.error(err.stack);
    } finally {
        await client.close();
    }
}

seed();
