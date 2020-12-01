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

router.get('/:id', function(req, res) {
  var collection = db.get('users');
  collection.findOne({_id: req.params.id},
    function(err, user){
      if (err) throw err;
      res.redirect("/settings");
    });
  });

module.exports = router;
