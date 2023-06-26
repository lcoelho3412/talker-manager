const ageValidator = (req, res, next) => {
  const { age } = req.body;
if (!age) {
  return res.status(400).json({ message: 'O campo "age" é obrigatório' });
} 
if (Number.isInteger(age) && age < 18) {
  return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
}
next();
};

const nameValidator = (req, res, next) => {
  const { name } = req.body;
if (name === undefined) {
  return res.status(400).json({ message: 'O campo "name" é obrigatório' });
} 
if (name.length < 3) {
  return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
}
next();
};

module.exports = { ageValidator, nameValidator };