const fs = require('fs');
const https = require('https');
const path = require('path');

const profileAssets = {
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBjOTNjYmFjN2E5YTRhYTY4ZDEyZTFmYmRhN2M0MzNiEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AOfcidV0OvgCkqVjPOqbVIIfPUTEcwqloZ4i4OhS0G783Fb5cJCNTVrI_hrBadkswZfBH6xS8GlrRx4o0-spuBLbqm8qlJikB5BJf9eAv8fnch0F5SMqL-d0qABD378OACwKTm5SkeLsGNGf9Uxtz8lf2jqZ2tl4SotA2ZvocKIg6Dbpo--qQbW2OYCdRe01tjR-uSrMNBsRvxT98cFTFzCk6-qyCGfR4oFdE8OU_bNBFyXOaO7-VYXiTojKS9U"
};

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
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
    console.log("Downloading Profile assets...");
    await downloadFile(profileAssets.htmlUrl, 'profile-stitch.html');
    await downloadFile(profileAssets.screenshotUrl, 'profile-stitch.png');
    console.log("Download complete.");
}

main();
