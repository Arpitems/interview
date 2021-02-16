const express = require('express')
const router = express.Router();
//------------------- Controller Path -------------------
const RandomGenerate_controller = require('../controller/RandomGenerate_controller')


//------------------- Router -------------------
router.post('/showRandomGenerate',RandomGenerate_controller.Show_RandomGenerate);


module.exports = router   