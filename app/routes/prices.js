const { Router } = require("express")
const router = Router()

const { isLoggedIn, isAdmin } = require("../middleware/auth")
const pricesDAO = require('../daos/price')

router.get("/", async (req, res, next) => {
    try {
        const coinPrices = await pricesDAO.getPrices();
        res.json(coinPrices);
    } catch (e) {
        next(e);
    }
});

router.get("/stats/:coinId", async (req, res, next) => {
    try {
        const coinId = req.params.coinId;
        const days = parseInt(req.query.days);
        const priceData = await pricesDAO.getCoinStats(coinId, days);
        res.json(priceData);
    } catch (e) {
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const priceId = req.params.id;
        const priceData = await pricesDAO.getPricesById(priceId);
        res.json(priceData);
    } catch (e) {
        next(e);
    }
});

router.get("/trend/:id", async (req, res, next) => {
    try {
        const priceId = req.params.id;
        const days = parseInt(req.query.days);
        const priceData = await pricesDAO.getPricesById(priceId);
        if (days === 1) {
            res.json(priceData.prices_hourly);
        } else {
            const prices = priceData.prices_daily.slice(-(days + 1));
            res.json(prices);
        }
    } catch (e) {
        next(e);
    }
});

router.use(isLoggedIn);
router.use(isAdmin);

router.post("/", async (req, res, next) => {
    try {
        const price = req.body;
        if (!price || JSON.stringify(price) === "{}") {
            res.status(400).send("price data is required");
        } else {
        const newPrice = await pricesDAO.create(price);
        res.json(newPrice);
        }
    } catch (e) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const price = req.body;
        if (!price || JSON.stringify(price) === "{}") {
            res.status(400).send("price data is required");
        } else {
            const result = await pricesDAO.updateById(id, price);
            if (!result) {
                res.status(404).send('No match ID, no updates.');
            } else {
                res.json(result);
            }
        }
    } catch (e) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const price = await pricesDAO.removeById(id);
        if (!price) {
            res.status(400).send("price id is required");
        } else {
            res.sendStatus(200);
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
