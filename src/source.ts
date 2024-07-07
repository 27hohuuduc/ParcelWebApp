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

export default async function clone(url: string = DEFAULT, packageName: string, eslint: boolean, proxy?: string) {
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
                    const buffer = entry.getData()
                    switch (basename(entry.entryName)) {
                        case 'package.json':
                        case 'package.eslint.json':
                            const pkg = JSON.parse(buffer.toString("utf-8"))
                            pkg.name = packageName
                            fs.writeFileSync(executePath, JSON.stringify(pkg, null, 2))
                            continue
                    }
                    fs.writeFileSync(executePath, buffer.toString("utf-8"))
                }
            }
            if (eslint) {
                if (fs.existsSync(`${path}/package.json`))
                    fs.unlinkSync(`${path}/package.json`)
                if (fs.existsSync(`${path}/package.eslint.json`))
                    fs.renameSync(`${path}/package.eslint.json`, `${path}/package.json`)

            }
            else {
                if (fs.existsSync(`${path}/eslint.config.js`))
                    fs.unlinkSync(`${path}/eslint.config.js`)
                if (fs.existsSync(`${path}/package.eslint.json`))
                    fs.unlinkSync(`${path}/package.eslint.json`)
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