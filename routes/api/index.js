// This file establishes the API. It is also used to define the base API routes for each 
// object. For example, the users object can be interacted with by making requests to the
// /api/users route. 

const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
