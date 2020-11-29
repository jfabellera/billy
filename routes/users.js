var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.user && req.session.user.account_type == "admin") {
    res.render('admin/users', { session: req.session });
  } else {
    res.status(401).send("Unauthorized");
  }
});

module.exports = router;
