// const fetch = require('node-fetch'); // Native fetch is available in Node 20+

async function verify() {
    try {
        console.log("Verifying Data Plans...");
        const dataRes = await fetch('http://localhost:3000/api/admin/data-plans');
        const dataPlans = await dataRes.json();

        if (dataPlans.length === 0) {
            console.log("No data plans found.");
        } else {
            console.log(`Found ${dataPlans.length} data plans.`);
            console.log("All Data Plans:");
            console.log(JSON.stringify(dataPlans, null, 2));
        }

        console.log("\nVerifying Airtime Plans...");
        const airtimeRes = await fetch('http://localhost:3000/api/admin/airtime-plans');
        const airtimePlans = await airtimeRes.json();

        if (airtimePlans.length === 0) {
            console.log("No airtime plans found.");
        } else {
            console.log(`Found ${airtimePlans.length} airtime plans.`);
            console.log("Sample Airtime Plan (MTN 100):");
            const sampleAirtime = airtimePlans.find(p => p.network === 'MTN' && p.amount === 100);
            console.log(sampleAirtime);
        }

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verify();
