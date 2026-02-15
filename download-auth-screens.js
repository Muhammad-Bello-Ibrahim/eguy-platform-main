const fs = require('fs');
const https = require('https');

const screens = [
    {
        id: "0aa55939eb884f27ab411308fa6fda9a",
        name: "welcome-network",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc2ZDkyNDhhNDEyYzQ2ODY4NTM4Y2ZhMzU4YWEzNWNlEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidXnp8oYIHDljssAPvukPsiw2DDZ81OVj5eH02nSn-fDf3df2DMUOAAPeKnmd0RHBBNxkCDojCNlBfiH4CB3UKhNNddPIHm4bAFcYAcnEvlEcDHo2jlQ0tAeH-POowbnoWHzDl9Lc1O7VCksC_N41YHCiX9mR2toGEWz6u9N4SdbSgdGPNayfmTa9vnVTUufFrKs2Y6zQWlNNOgGrBnbmtPTZ-VPir-l8Nb_iH_qkqpqPppmuyAasRQPxA"
    },
    {
        id: "304d2eca791d4f179e7baf941661a802",
        name: "secure-login",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc2MTViYzEzNTIxMjRmYTg5YWIyMDg1MGVjODQ1ZGI0EgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidWePGK_BJ3ABwmsv8m-2vx_BPH4STBT5Or0ksFQIEWIb-BDSrS3NNPYScV-9XvnalvFdgnWb29UzGCq4TUGU_kQQR3Xsrr66xH0v4iViTxaqUWUUYSFA42y6TNenS81dM0U_P0yIb_Cbkx7051-A1Pi59uLD5iKE1DuUhS4S2-TwSJNBbeoIAvgUe3IxFOli2XH9CPwB4-fy-CSY2pyDji_XiMCqSdApbuYR1PzbgF7r7Nz5XDXnCO4WXE"
    },
    {
        id: "3b11d0cf8ad54b81822a83c9d78a1a1c",
        name: "recovery-email-sent",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2YzMTFlOGY5M2Q3NzQyNjZhZjJkZTMyZmMwYWJhNjlhEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidU_8EbsKQ0EzQb-PVztaRaEXqgfr7cg0WCiXWg0GUl1Lalne3O2t9tpaQGg6azfu23uw5z-_QwcK4_tgr4QmZ7GcGobt2qLz_hJ9MkZeM9chj8O5uyfbKn_nxkvzQKELXgv0UNwfSuqpca78lWEWxsNmyqC3P8h7O2m0yfOdPWObrLIri6-fDjtQx00x24jle8DD0gIQjpu0_0uDgCt4yxOKYWPr2gp_eUVPTH_OY03gvRdGxkVDHZL-g"
    },
    {
        id: "80d2ffbde2d84b52a74b3d872b1308d7",
        name: "reset-password-1",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2M4YmQ2ZTI4MWYzYzRmNzhiZjdhNWU2NjBjMDYyNTMzEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidV3PJeMu1GbPdPstEr2sdXuepJ3ylAi6Bo9IBE2kHo1Mms2hU695_hI0bmTrzKYbgwJcP9HqwsRVi7sM7yJv7K2KW3WfL8aaB2atj4O3yTn3Zk14dk83PXP_e2sp6DuaFjbJjyqoEN41l4RNftQmvhixJiRSYjUErzdjUGScg2T1MytGUvhJ0ixsOmAbbLlef5SsCCMvdlJlu3OC__nJGL8pJCk1gD49dyCym-rZSqF7KFZypSOKDlkkEU"
    },
    {
        id: "859e2be8232c4960b32475d5563613fb",
        name: "reset-password-2",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzEwZjc5ZDc0ZWFjODRiZjU4MzA3NDJiMjJmNWQxYmU0EgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidUdnhvwbFQbEA35dhfsx7RG0DHQkQx_Ot9BBekaZUNehtrKnqOgaN-QT0d5rRGt6b0yPtRNm-_Xriin9ObSu1FusDriPZMgYncvAlAvMDub_DuDu-3QM1yD1UyjReSMRHtpFV6GyUJsPRytzsu_yEl_K7_Ik1DK6BY80ecnYPKXrLQ94N7bawxXfyglrCsM_97RpoIjaDF3Xd87cpwulPWzpMwfeajG3KjlqZvN186UlonmGv2cvOny0Q"
    },
    {
        id: "a3bfdb42169e497dae5204ae7f93a707",
        name: "secure-account-step-3",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2M4ZWFkMDkxZDAyZTQ4ZmU4NzU3ZDQ3MTg0YWVhNTMyEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidWt5kuZqxjzRsBqtLcGzTvq4cvJPIu6CoXiEOzwQb5ycG5O7S8IT_cZeN4JPOb1Ten6P33UaV6ighWb5vzEZ0l-DY9wRw33gvO8NsSeNbRDueKtSJWp51Do26ZdSpgnzSiJZaxPJ1J39U6j1U4ELDfKdRei53t7T1lrGQpLPrkSZNeBn94o2C2TZlcf-5OYv0sFbxWHKCsvYF13qA2rA2MDBLak3Vx-2TuYk351A_mFpafu01nB2avITLI"
    },
    {
        id: "b48ce7841fa9405e80c8b1f08cbadb34",
        name: "password-updated",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFmMzhlODE3YjM2OTQ1MWViYmIzZDgyNGIwYWQzNTQxEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidWZmgo1J2ZhX7aQwBTfejLdYId7Nnbq9NEbD8ETZuy265p_I34fZ9QVkDg0RTwCjdLpQdx611WY6TU-se57YOdX1s90xKE3NGhEKcZUIDit1YnSJ_iM_zADsazWK4rAyZ6HLOEUx7Mm-T_PmgZqgCafFiAdfa2UzHZ9deu-tcacMkmHaaQe6zIqEVZJYIWDfMe96gvnugT8PYPzRC0YPD0ykcCOq3l22fa49uim6RI8w5DvWhnDkrs6ajU"
    },
    {
        id: "cc5628a01d654b7c97f8a9f6b0a3fdf6",
        name: "personal-details-step-2",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzg1MDc4YjcyYzU2MDRkOTk4OTFmMWZkZmIyODgwODM4EgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidUpQqUXUXSSPGKjxAS_TJ-e2dmqi2Hlw2hHAZn85NdorStNwF1bZu53VdrlMusuNuVn_-ek2mgsuQXv4z2w2J16e2b78DjISqZxjZX2QFP3QnnIGhIucmSYydO2bwnN9dgguuMd5ZDnwWG0sz_pn57gMGltQX7u0y-dwXKEg2fGFOx9c9LYBJwWpNxsL4aEaIw3SdcvHd_jVkSLIz6BeYt1VfrD3lDm7_tMM10_IPj6eXjrF4uFM6DU3A"
    },
    {
        id: "db2f19d010ba40e6a39c4453dbf6f8a4",
        name: "create-account",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA0YjEzNGJlZTY4NjQ3YmM4ZmU1MzljM2M3Y2Q5ZWRhEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidUSt7DwvAt4Mre6VWkj04P1jQK-QBYtLLrsEuAwkLswxv_9H4ty95Xlap5ZQbnfjCn0jWeaxASempzsAh2iaE4K2to6coyCCAK-egjjiNP1UclZWkkwCoHH3Jp3orBHVHImcMEXmLLcWZlmPJwmua3GOKWBLj-boeXC_ao1h3jJza8L7_cRWuUMw59ihggHOTP2Pwk3WunfZaDOZGZxZ4llyEfM-rnQPO-FwNAER1G-FnkkpnhN0yAPeks"
    },
    {
        id: "f85baec28d2f41138d69da00fa4305dc",
        name: "email-verified",
        htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzg5MmQ3ZTVjN2ZmNDQ1ZGNhNTIxYTNhMDYwYTQ0M2IzEgsSBxDp0Z35mQwYAZIBIwoKcHJvamVjdF9pZBIVQhM2NDM3OTkwMDU2MTAwNzM2MTky&filename=&opi=89354086",
        imgUrl: "https://lh3.googleusercontent.com/aida/AOfcidUGvXUvq4pejZop4_2vn9vTf4dRBMwylO7mhdFLyPmMy2JTNDiFUBJUf_NiAZ94aLZSnD5uaBDQpBev5BqJEB-4UuxL9Y3x0IIHcI0U8QRNIc3XNCKNYT3ESnGicmP7Wx9dmebINVl2LNgVYyZ-IWVgr7bHKOPK_lcVMzBdOym_eTIuodVvxuMH4odHzr4CVxIldj9Qc7zJ_FsBIOWZe9J_CEsOkJ3f58odfmWbP63DCThMESTvFu_6VQ"
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
        console.log(`Downloading screen ${screen.id} (${screen.name})...`);
        try {
            await downloadFile(screen.htmlUrl, `screen-${screen.id}.html`);
            await downloadFile(screen.imgUrl, `screen-${screen.id}.png`);
        } catch (error) {
            console.error(`Error downloading ${screen.id}:`, error);
        }
    }
    console.log("All downloads complete.");
}

main();
