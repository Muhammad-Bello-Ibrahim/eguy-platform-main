const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const screens = [
    {
        name: 'elevatex',
        imageUrl: 'https://lh3.googleusercontent.com/aida/AOfcidXikeA3aveT1BPk68dqif_u9tI1mjHxryj6bYtWuKMsTak2lreCCTxDcXFIMb4NapTlu8UbmzggQwWPFuCidBdcmTHrcRPHVRV2pCOdxj2yWlHnVoGislRpsI8_-BFDU289WBWDxGaunszyr61_1m7WM7WGPyuYW72Yu22fX36x_Z9R3beDEAZ84bPLlm0VB5nZPIzhsK5DONkoG2bWtafsJlvlRo8v8Lzr-LiMHmpgu6ouBAujduJ1vw',
        htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2IzNTRmYzM5NTI3MTQ1MDFhMTkxZDEwZTdkOTdjNDJiEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086'
    },
    {
        name: 'notifications',
        imageUrl: 'https://lh3.googleusercontent.com/aida/AOfcidXpIk4lWSXsqeEHJcfAaq6aswZFJFdQ4WKPE9ifQF5FGitmUdrIKDCLoCUs8quoL_Wlfc_VRVnqHrB-xM9f5M9Kh3PO3LN35qELYXhl5VBq0qlETo_KYl31IT1OwStNx38gkiDirEuSNtqYb0hxqwpmzeIqXPQb_BAUiIZOiPLXrMhSZPe5DToKVFEKSpYQ0lpqx4gT_2i5-IR_agpQ3m-_v0tmIzOJF8toc7TFT3YUTi39Eys8Udp1UA',
        htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ0NDVhMzg2NzczMTQ0ODBiMTExYWVmNmFkN2U5MWYxEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086'
    },
    {
        name: 'fund-wallet',
        imageUrl: 'https://lh3.googleusercontent.com/aida/AOfcidXbgwQBMG6rJWmXDyVUdC2OloWv-gvUSmCv3ccpuVgh6hDo6U9twti88YXaoiTr4H6QVBva6HxcwjNGcz2B0WfDBD9S7Z3UuMf9UdDUn9lXZKGl3kdxG_HC9HDsLW0huKsnGLz4n53II0O3npw3GTgtohV_OXo-DteIz6V0tiUPdVoMwv7n6dNrg_cEqeMosc1-FmNg-0qaBZha-9P2G5DAoql5GPpr-jjLiYGigDodyEtGS4iBUxH2Dg',
        htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzM3ZGJkNmQ4YzI5NDQ4ZWY4YTU0Y2IxNWRkMDBkYmIxEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086'
    },
    {
        name: 'withdraw-funds',
        imageUrl: 'https://lh3.googleusercontent.com/aida/AOfcidXaXjxjbeyEx6uOs2UlVdHpyleIQa1n94hTYFwg4tVZMXuapTg1am0Cy9xUa8-nU3Y4bV2Z9cqGWoZcCYVvJDqfhG_cPjqEscUCiuCwl8zlwY5gcInuQUomZLZAiMxJBCSURx5T3XsTeBIcugauED5stB2X_JZ8LuvsNIGlpIVyaewSx6QK3nizawCkQXCM55TqeBPcRFF6IwD4-aX2ZCrk7ZDpNH3iGxXoGfu8fJYU_WyAkS_3GK-PJYI',
        htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzk0NTBiZDEzYmMxNzQ1Njk4NjE0OTk4ZTk5OTNmM2MyEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086'
    }
];

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        exec(`curl -L "${url}" -o "${dest}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading ${url}:`, error);
                reject(error);
            } else {
                console.log(`Downloaded ${url} to ${dest}`);
                resolve();
            }
        });
    });
};

const main = async () => {
    // Determine the stitch-assets directory path
    const assetsDir = path.join(__dirname, 'stitch-assets');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    for (const screen of screens) {
        await downloadFile(screen.imageUrl, path.join(assetsDir, `${screen.name}.png`));
        await downloadFile(screen.htmlUrl, path.join(assetsDir, `${screen.name}.html`));
    }
};

main();
