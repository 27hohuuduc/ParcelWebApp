import AdmZip from 'adm-zip'
import fs from 'fs'
import { basename } from 'path'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch, { RequestInit, Response } from 'node-fetch'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_TLS_REJECT_UNAUTHORIZED: number;
        }
    }
}

export const DEFAULT = 'https://github.com/27hohuuduc/ParcelWebApp/archive/refs/heads/default.zip'
export const VANILLA = 'https://github.com/27hohuuduc/ParcelWebApp/archive/refs/heads/vanilla.zip'

export default async function clone(url: string = DEFAULT, packageName: string, proxy?: string) {
    let init: RequestInit | undefined
    if (proxy) {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
        init = { agent: new HttpsProxyAgent(proxy) }
    }
    return await fetch(url, init)
        .then((res: Response) => res.arrayBuffer())
        .then(arrBuffer => {
            const zip = new AdmZip(toBuffer(arrBuffer))
            const entries = zip.getEntries()
            const path = process.cwd()
            const zipName = entries[0].entryName.length
            for (var i = 1; i < entries.length; i++) {
                const entry = entries[i]
                //Remove zipname and combine folders
                const executePath = `${path}/${entry.entryName.substring(zipName)}`
                if (entry.isDirectory) {
                    if (!fs.existsSync(executePath))
                        fs.mkdirSync(executePath)
                }
                else {
                    const buffer = entry.getData();
                    if (basename(entry.entryName) === 'package.json') {
                        const pkg = JSON.parse(buffer.toString("utf-8"))
                        pkg.name = packageName
                        fs.writeFileSync(executePath, JSON.stringify(pkg, null, 2))
                        continue
                    }
                    fs.writeFileSync(executePath, buffer.toString("utf-8"))
                }
            }
        })
}

function toBuffer(arrBuffer: ArrayBuffer) {
    const buffer = Buffer.alloc(arrBuffer.byteLength);
    const view = new Uint8Array(arrBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}



































// const axios = require("axios");
// const AdmZip = require('adm-zip');

// async function get(url) {
//     const options =  {
//         method: 'GET',
//         url: url,
//         responseType: "arraybuffer"
//     };
//     const { data } = await axios(options);
//     return data;
// }

// async function getAndUnZip(url) {
//     const zipFileBuffer = await get(url);
//     const zip = new AdmZip(zipFileBuffer);
//     const entries = zip.getEntries();
//     for(let entry of entries) {
//         const buffer = entry.getData();
//         console.log("File: " + entry.entryName + ", length (bytes): " + buffer.length + ", contents: " + buffer.toString("utf-8"));
//     }
// }

// getAndUnZip('https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip');