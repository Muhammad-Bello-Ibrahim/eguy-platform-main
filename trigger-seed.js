async function triggerSeed() {
    try {
        console.log("Triggering Data Plans Seed...");
        const dataRes = await fetch('http://localhost:3000/api/admin/data-plans', {
            method: 'PUT'
        });
        const dataResult = await dataRes.json();
        console.log("Data Plans Result:", dataResult);

        console.log("\nTriggering Airtime Plans Seed...");
        const airtimeRes = await fetch('http://localhost:3000/api/admin/airtime-plans', {
            method: 'PUT'
        });
        const airtimeResult = await airtimeRes.json();
        console.log("Airtime Plans Result:", airtimeResult);

    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

triggerSeed();
