const fs = require('fs');
const https = require('https');

const screens = [
    {
        id: "43ec6af1",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U2ZmU0NmFiODNlYTQzNzJhMGQ1YjJmZTY2YWI4ZGJhEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidVqNjeiRtolZTQNs90aAlEGNaBQQxXRjNTQ4Lc6iltIzX6qG76aXClgHWckZ523Dfx8AeML1S1L5OEgCMH4MXJM2qd8UKXMYH8MCtgpvekdsDfPotZGQ6faOm1rExYX15Ybe7p-GNpCqdiYXfMVNJ6YyWSTmFNqeaucYXENmUkblbu5SfDj6oxQm-mvWl58sO0qk-ldiZMH8SqCbQ6L1QgzWaBVeE26B4RSwO9wzR4z2EFDVJugrvQD-fY"
    },
    {
        id: "9183ca12",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2NkZjFlMWVlNzA1MzQwMjc5YTBjOTExODA3ODRkZTFjEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidUENNt91eMdvq57-tym4eMiGwlDjMzDMVo26kV7JS5yNrFf5eNv9tVFWJFIjHfJjRJp-caOx060s9G9VOnpr_rvm7M1IElzEid5bthpymjxHoM-2Wcf6xJ3yWBeHhosbeUcipfN_ZjslgIywxjRFPOJiuj_RiU58yWb5vpj90ge2o64yz2qhVD-ccQ7FQXqwehjpI88Ec9nXze9Ywx3XyEMmTNCl0lVbWPS7MIcuBJ2ZhIqfuj-gWtThyk"
    },
    {
        id: "e1cbe594",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzkwOGE4NTE0YTdkNDRjYTFiODQzYmQ0OTQxNTBiZTc1EgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidXL41CfJi4cEqg-aTdzRdzKuhVhlUAB3zMM0FgN1hudEWmu-jqN6IOl396hrQaFctXZ_SKT3BQE_ZpMzHYJkqEbC0Mpb1QjaMyNkoQa6xAGRuJHK9lzfiu_ibprWOSdurM3SafWV-aQTFG8xPws0QO8nVbp8GHwX6fufz3GDWmFds8y0XOiEAP0S_QH-mxx8V_OCQ4RWdh4IsTzEYOgzBhAeBzuU_drLJbL9jblMpm10bL25bLM-4q0kDU"
    },
    {
        id: "04ec0dd4",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzhmZWQzN2Y5MGFjODRlOWI4NmEyOWI5M2M4ZjM1ZThlEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidVxkbf25ixyybTyfZJwtVuXZaokvVF-XEvhgshja36BPAvqaMZkABWU1wcSfzM8B25zUM5zGsLb7dKzt2LKgEFCYffA2mxJHj8nNkHc502ySN6Vuibo1rbtNKtUtgUYyUxwRNgWl1YL6P1PrnPx5q3x-p8Fcpt6oCw1R6AeVPNkXuDh5IVNGbj23KycYklL72UZF3NXICzdgPZpaAXUfLswyO575zYEVaiR6S7AbAFVOFE5zDH9qib59B4"
    }
];

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function main() {
    console.log("Starting downloads...");
    for (const screen of screens) {
        console.log(`Downloading screen ${screen.id}...`);
        await downloadFile(screen.htmlUrl, `screen-${screen.id}.html`);
        await downloadFile(screen.imgUrl, `screen-${screen.id}.png`);
    }
    console.log("All downloads complete.");
}

main();
