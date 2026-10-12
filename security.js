import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, studentId: user.student_id ?? null },
    process.env.JWT_SECRET,
    { expiresIn: '8h', issuer: 'detlof-school-api', audience: 'detlof-school-web' }
  );
}
export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'detlof-school-api', audience: 'detlof-school-web'
    });
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
}
export function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user?.role)
    ? next()
    : res.status(403).json({ error: 'You are not authorised to perform this action.' });
}
