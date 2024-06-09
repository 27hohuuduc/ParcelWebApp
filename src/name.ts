export function check(str: string): boolean {
    return /(?=^[a-z0-9])^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/g.test(str)
}

export function format(str: string): string {
    return str.toLowerCase().replace(/^_|[^a-z0-9 _-]/g, "").trim().replace(/  */g, '-')
}