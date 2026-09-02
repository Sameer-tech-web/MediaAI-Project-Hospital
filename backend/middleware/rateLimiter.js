const attempts = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const limitLoginAttempts = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.windowStart + WINDOW_MS - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({
      message: `Too many login attempts. Try again in ${retryAfter} seconds.`,
    });
  }

  return next();
};

const clearLoginAttempt = (req, _res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  attempts.delete(ip);
  next();
};

module.exports = { limitLoginAttempts, clearLoginAttempt };
