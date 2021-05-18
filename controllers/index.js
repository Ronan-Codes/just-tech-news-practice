const router = require('express').Router();

const apiRoutes = require('./api');
// for homeRoutes
const homeRoutes = require('./home-routes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// This is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating
    // we have requested an incorrect resource, another RESTful API practice.
// router.use((req, res) => {
//     res.status(404).end();
// });
// This may prevent the utilization of public/stylesheets/style.css from server.js

module.exports = router;
