const express = require('express');
const router = express.Router();
const controller = require('./task-controller.js');

router.get('', controller.getAllTask);
router.post('/save', controller.saveToDatabase);
router.post('', controller.createTask);
router.put('', controller.updateTask);
router.delete('', controller.deleteTask);

module.exports = router;