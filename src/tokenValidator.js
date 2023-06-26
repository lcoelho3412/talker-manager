const tokenValidator = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  const wrongLength = authorization.length === 16;
  const isNumber = Number.isNaN(Number(authorization));
  if (isNumber && wrongLength) {
    next();
  } else {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = tokenValidator;