const express = require("express");
const controller = require("./controller.js");

const router = express.Router();

router.post("/", controller.createList);
router.get('/:idList/clients', controller.getClientsOnList);
router.get("/:id", controller.getList);
router.get("/", controller.getLists);
router.patch('/:id', controller.updateList);
router.delete('/:id', controller.deleteList);

module.exports = router;
