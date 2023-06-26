const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs').promises;

const path = require('path');

const PATH_NAME = path.resolve(__dirname, 'talker.json');
const { 
  talkerReader,
  idFinder, 
  tokenGenerator,
  passwordValidator, 
  emailValidator,
  idGenerator,
  talkerDeleter,
} = require('./loginValidators');

const { ageValidator, 
  nameValidator,
   } = require('./talkerValidators');
const talkValidator = require('./talkValidator');
const tokenValidator = require('./tokenValidator');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkersAll = await talkerReader();
  if (talkersAll) {
    return res.status(HTTP_OK_STATUS).json(talkersAll);
  }
    return res.status(404);
  });

  app.get('/talker/search', tokenValidator, async (req, res) => {
    const { q } = req.query;
    const talkersAll = await talkerReader();
    const test = talkersAll.filter((query) => query.name.includes(q));
    return res.status(HTTP_OK_STATUS).json(test);
  });

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkerId = await idFinder(id);
  if (talkerId) {
    return res.status(HTTP_OK_STATUS).json(talkerId);
  }
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  });

  app.post('/login', emailValidator, passwordValidator, (req, res) => {
    const token = tokenGenerator();
    try {
      const { email, password } = req.body;
      if (email && password) {
        return res.status(HTTP_OK_STATUS).json({ token });
      }
    } catch (error) {
      console.error(error);
    }
  });

app.post(
  '/talker', tokenValidator, nameValidator, ageValidator, talkValidator,
  async (req, res) => {
    const readTalkers = JSON.parse(await fs.readFile(PATH_NAME, 'utf8'));
    const talkerAdd = { ...req.body, id: idGenerator(readTalkers) };
  readTalkers.push(talkerAdd);
  await fs.writeFile(PATH_NAME, JSON.stringify(readTalkers));
  return res.status(201).json(talkerAdd);
},
);

app.put('/talker/:id', 
tokenValidator, 
nameValidator, 
ageValidator, 
talkValidator,
async (req, res) => {
  const id = Number(req.params.id);
  const { body } = req;
  const readTalkers = JSON.parse(await fs.readFile(PATH_NAME, 'utf8'));
  const index = readTalkers.findIndex((talker) => talker.id === id);
  const talkerToUpdate = { ...readTalkers[index], ...body };
  readTalkers.splice(index, 1, talkerToUpdate);
await fs.writeFile(PATH_NAME, JSON.stringify(readTalkers));
return res.status(200).json(talkerToUpdate);
});

app.delete('/talker/:id', tokenValidator, async (req, res) => {
  const talkerId = Number(req.params.id);
  console.log(talkerId);
  await talkerDeleter(talkerId);
  return res.status(204).json();
});
