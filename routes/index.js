const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => res.send('Whoops that route is invalid, please try again.'));

module.exports = router;