const fs = require('fs').promises;
const crypto = require('crypto');

const talkerReader = async () => {
  try {
      const data = await fs.readFile('src/talker.json', 'utf-8');
      const talkerToObj = JSON.parse(data);
      return [...talkerToObj];
  } catch (error) {
      console.error('erro na leitura do arquivo');
      return [];
  }
};

async function talkerDeleter(talkerId) {
  try {
      const currentTalkerData = await talkerReader();
      const undeletedTalkerData = currentTalkerData
      .filter((talker) => talker.id !== talkerId);
      await fs.writeFile('./src/talker.json', JSON.stringify(undeletedTalkerData));
      return undeletedTalkerData;
  } catch (error) {
      console.log(`erro na remoção dos dados: ${error}`);
  }
}

const idGenerator = (talkerJSON) => talkerJSON.length + 1;

const idFinder = async (id) => {
  const talkers = await talkerReader();
  const talkerId = talkers.find((talker) => talker.id === Number(id));
  return talkerId;
};

const tokenGenerator = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

const emailValidator = (req, res, next) => {
  const { email } = req.body;
  const validEmail = /\S+@\S+\.\S+/;
 
  if (!email) {
     return res.status(400)
     .json({ message: 'O campo "email" é obrigatório' });
  }
 
  if (!validEmail.test(email)) {
     return res.status(400)
     .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next();
 };

 const passwordValidator = (req, res, next) => {
  const { password } = req.body;
  const maxPasswordLength = 6;

  if (!password) {
      return res.status(400)
      .json({ message: 'O campo "password" é obrigatório' });
  }
if (password.length < maxPasswordLength) {
  return res.status(400)
  .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
}
return next();
};

 module.exports = {
    talkerReader,
    idFinder,
    tokenGenerator,
    emailValidator,
    passwordValidator,
    idGenerator,
    talkerDeleter,
    
 };