const globalForCache = global as unknown as { otpCache?: Map<string, string> };
const cache = globalForCache.otpCache ??= new Map();

export default cache