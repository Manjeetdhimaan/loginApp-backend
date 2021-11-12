"use strict";

var router = require('express').Router();

var User = require('../models/User'); // router.get('/:id', (req, res) => {
//     User.findById(req.params.id).then(users => {
//         res.status(200).json(users);
//         console.log('Logged in user', users)
//     }).catch(err => {
//         res.status(500).json({ error: err.message })
//     })
// })


router.get('/', function (req, res) {
  User.find().then(function (users) {
    res.status(200).json(users);
  })["catch"](function (err) {
    res.status(500).json({
      error: err.message
    });
  });
});
router.post('/register', function _callee(req, res) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(userExists(req.body.email));

        case 2:
          if (!_context.sent) {
            _context.next = 6;
            break;
          }

          res.status(409).json({
            error: 'Email already exists'
          });
          _context.next = 9;
          break;

        case 6:
          newUser = new User(req.body);
          _context.next = 9;
          return regeneratorRuntime.awrap(newUser.save().then(function (user) {
            res.status(201).json(user);
          })["catch"](function (err) {
            res.status(500).json({
              error: err.message
            });
          }));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});

var userExists = function userExists(email) {
  var user;
  return regeneratorRuntime.async(function userExists$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: email.toLowerCase().trim()
          }));

        case 2:
          user = _context2.sent;

          if (!user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", true);

        case 7:
          return _context2.abrupt("return", false);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

router.post('/login', function (req, res) {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }).then(function (user) {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({
        error: 'Incorrect email or password'
      });
    }
  })["catch"](function (err) {
    res.status(500).json({
      error: err.message
    });
  });
});
router.get('/:id', function (req, res) {
  var id = req.params.id;
  User.findOne({
    _id: id
  }).then(function (user) {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({
        error: 'Incorrect email or password'
      });
    }
  })["catch"](function (err) {
    res.status(500).json({
      error: err.message
    });
  });
});
router.post('/insert/:id', function (req, res) {
  var id = req.params.id;
  var leaves = {
    remainingLeaves: req.body.remainingLeaves,
    totalLeaves: req.body.totalLeaves,
    appliedLeaves: req.body.appliedLeaves
  };
  User.updateOne({
    _id: id
  }, {
    $set: leaves
  }, {
    "new": true
  }, function (err, article) {
    if (err) return handleError(err);
    res.send(article);
  });
});
router.put('/updateLeaveStatus/:id', function (req, res) {
  var id = req.params.id;
  User.findOne({
    _id: id
  }, function (err, foundedObject) {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      if (!foundedObject) {
        res.status(404).send();
      } else {
        var leaveArray = [];
        ;
        foundedObject.leaves.map(function (a) {
          leaveArray.push(a);
        });
        leaveArray.map(function (n) {
          if (n['_id'] == req.body.id) {
            leaveArray[leaveArray.indexOf(n)].status = req.body.event;
            var to = leaveArray[leaveArray.indexOf(n)].to;
            var from = leaveArray[leaveArray.indexOf(n)].from;
            var diff = to.getDate() - from.getDate() + 1;

            if (leaveArray[leaveArray.indexOf(n)].status == "Denied" && req.body.prevStatus !== "Pending") {
              if (foundedObject.appliedLeaves > 0) {
                // foundedObject.appliedLeaves = Number(foundedObject.appliedLeaves) - Number(diff);
                if (foundedObject.remainingLeaves <= 24) {
                  foundedObject.remainingLeaves = Number(foundedObject.totalLeaves) + Number(diff);
                  foundedObject.totalLeaves = Number(foundedObject.remainingLeaves); // foundedObject.appliedLeaves = leaveArray.length
                }
              }
            }

            if (leaveArray[leaveArray.indexOf(n)].status === "Approved") {
              // foundedObject.appliedLeaves = Number(foundedObject.appliedLeaves) + Number(diff);
              foundedObject.remainingLeaves = Number(foundedObject.totalLeaves) - Number(diff);
              foundedObject.totalLeaves = Number(foundedObject.remainingLeaves); // foundedObject.appliedLeaves = leaveArray.length
            }
          }
        });
        foundedObject.save(function (err, updatedObject) {
          if (err) {
            console.log(err);
            res.status(500).send();
          } else {
            res.send(updatedObject);
          }
        });
      }
    }
  });
});
router.put('/update/:id', function (req, res) {
  var id = req.params.id;
  User.findOne({
    _id: id
  }, function (err, foundedObject) {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      if (!foundedObject) {
        res.status(404).send();
      } else {
        if (req.body.fullname) {
          foundedObject.fullname = req.body.fullname;
        }

        if (req.body.email) {
          foundedObject.email = req.body.email;
        }

        if (req.body.password) {
          foundedObject.password = req.body.password;
        }

        if (req.body.bio) {
          foundedObject.bio = req.body.bio;
        }

        foundedObject.save(function (err, updatedObject) {
          if (err) {
            console.log(err);
            res.status(500).send();
          } else {
            res.send(updatedObject);
          }
        });
      }
    }
  });
}); //check in

router.post("/:id/enter", function _callee2(req, res) {
  var data, user, lastCheckIn, nextMidNight, pastMidNight;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          data = {
            entry: Date.now()
          };
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.params.id
          }));

        case 4:
          user = _context3.sent;

          if (!(user.attendance || user.attendance.length > 0)) {
            _context3.next = 25;
            break;
          }

          //for a new checkin attendance, the last checkin
          //must be at least 24hrs less than the new checkin time;
          // const lastCheckInTimestamp = lastCheckIn.date;
          // var ts = Math.round(new Date().getTime() / 1000);
          // var tsYesterday = ts - (24 * 3600);
          // console.log(Date.now(), lastCheckInTimestamp);
          // if(ts<tsYesterday){
          // }
          lastCheckIn = user.attendance[user.attendance.length - 1];

          if (!lastCheckIn) {
            lastCheckIn = {
              exit: {
                exitType: 'Full day',
                time: new Date()
              },
              entry: new Date().setHours(-24, 0, 0, 0),
              _id: "616fd18fc902ba3a12893ab4",
              date: Date.now()
            };
          }

          if (lastCheckIn.exit.time) {
            _context3.next = 11;
            break;
          }

          res.send("Please checkout ".concat(user.fullname, "'s previous check in first"));
          return _context3.abrupt("return");

        case 11:
          nextMidNight = new Date();
          nextMidNight.setHours(24, 0, 0, 0);
          pastMidNight = new Date();
          pastMidNight.setHours(0, 0, 0, 0); // const lastAttendance = user.attendance[user.attendance.length - 1];
          // console.log(lastAttendance.entry<nextMidNight)
          //if (pastMidNight>lastAttendance.entry){}
          // Date.now() > lastCheckInTimestamp

          if (!(pastMidNight > lastCheckIn.entry)) {
            _context3.next = 22;
            break;
          }

          user.attendance.push(data);
          _context3.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          res.status(200).json(user);
          _context3.next = 23;
          break;

        case 22:
          res.send("".concat(user.fullname, " have signed in today already"));

        case 23:
          _context3.next = 28;
          break;

        case 25:
          user.attendance.push(data);
          _context3.next = 28;
          return regeneratorRuntime.awrap(user.save());

        case 28:
          _context3.next = 34;
          break;

        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](0);
          console.log("something went wrong");
          console.log(_context3.t0);

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 30]]);
}); //check out

router.post("/:id/exit", function _callee3(req, res) {
  var user, lastAttendance;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.params.id
          }));

        case 3:
          user = _context4.sent;

          if (!(user.attendance && user.attendance.length > 0)) {
            _context4.next = 16;
            break;
          }

          //check whether the exit time of the last element of the attedance entry has a value
          lastAttendance = user.attendance[user.attendance.length - 1];

          if (!lastAttendance.exit.time) {
            _context4.next = 9;
            break;
          }

          res.send("".concat(user.fullname, " has already checked out today"));
          return _context4.abrupt("return");

        case 9:
          lastAttendance.exit.time = Date.now();
          lastAttendance.exit.exitType = req.body.exitType;
          _context4.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          res.status(200).json(user);
          _context4.next = 17;
          break;

        case 16:
          //if no entry
          res.send("".concat(user.fullname, " do not have an attendance entry"));

        case 17:
          _context4.next = 22;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](0);
          console.log('Cannot find User');

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 19]]);
}); //leave management

router.post("/:id/apply", function _callee4(req, res) {
  var data, user;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          data = {
            from: new Date(req.body.from),
            to: new Date(req.body.to),
            reason: req.body.reason,
            status: req.body.status
          };
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.params.id
          }));

        case 4:
          user = _context5.sent;
          //check if there is an attendance entry
          user.leaves.push(data);
          _context5.next = 8;
          return regeneratorRuntime.awrap(user.save());

        case 8:
          res.status(200).json(user);
          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.log('Cannot find User');

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;