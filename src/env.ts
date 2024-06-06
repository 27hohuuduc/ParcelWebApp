import fs from 'fs'

interface IPackage { displayName: string, description: string, version: string }

export default JSON.parse(fs.readFileSync('../package.json', 'utf8')) as IPackage

export const GitHubTreeUrl = 'https://api.github.com/repos/27hohuuduc/ParcelTemplate/git/trees/main?recursive=2'