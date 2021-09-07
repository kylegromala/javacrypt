const { Router } = require('express');
const router = Router();

router.get("/", async (req, res, next) => {
    res.render('index');
});

module.exports = router;
