const express = require('express');
const app = express();

const {baseStats} = require('./data/baseStats.js');
const { runeStats } = require('./data/runeStats.js');
const {skillSets} = require('./data/skillSets.js');
const {skillsDict} = require('./data/skillsDict.js');
const {battlesInfos} = require('./data/battlesInfos.js');

app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/baseStats', async(req, res) => {
  try {
    res.send(baseStats).status(200);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/skillSets', async(req, res) => {
  try {
    res.send(skillSets).status(200);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/skillsDict', async(req, res) => {
  try {
    res.send(skillsDict).status(200);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/battlesInfos', async(req, res) => {
  try {
    res.send(battlesInfos).status(200);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/runeStats', async(req, res) => {
  try {
    res.send(runeStats).status(200);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

const server = app.listen(8082, function () {
   const port = server.address().port
   console.log("Example app listening at http://localhost:" + port)
})