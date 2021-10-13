const router = require('express').Router();
const User = require('../models/User');
var MongoClient = require('mongodb').MongoClient;

// router.get('/:id', (req, res) => {
//     User.findById(req.params.id).then(users => {
//         res.status(200).json(users);
//         console.log('Logged in user', users)
//     }).catch(err => {
//         res.status(500).json({ error: err.message })
//     })
// })

router.get('/', (req, res) => {
    User.find().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
})




router.post('/register', async (req, res) => {
    if (await userExists(req.body.email)) {
        res.status(409).json({ error: 'Email already exists' })
    }
    else {
        const newUser = new User(req.body)
        await newUser.save().then(user => {
            res.status(201).json(user)
        }).catch((err) => {
            res.status(500).json({ error: err.message })
        })
    }
})

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password }).then(user => {
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(401).json({ error: 'Incorrect email or password' })
        }
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    User.findOne({ _id: id }).then(user => {
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(401).json({ error: 'Incorrect email or password' })
        }
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
})

router.post('/insert/:id', (req, res) => {
    let id = req.params.id
    const leaves = {
        leaveType: req.body.leaveType,
        remainingLeaves: req.body.remainingLeaves,
        totalLeaves: req.body.totalLeaves,
        appliedLeaves: req.body.appliedLeaves
    };
    User.updateOne(
        { _id: id }, { $set: leaves }, { new: true }, function (err, article) {
            if (err) return handleError(err);
            res.send(article);
        });
});


router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }, (err, foundedObject) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (!foundedObject) {
                res.status(404).send();
            }
            else {
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
                foundedObject.save((err, updatedObject) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send();
                    }
                    else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})
//check in
router.post("/:id/enter", async (req, res) => {
    try {
        const data = {
            entry: Date.now()
        };
        const user = await User.findById(req.params.id);

        //if the user has an attendance array;

        if (user.attendance && user.attendance.length > 0) {
            //for a new checkin attendance, the last checkin
            //must be at least 24hrs less than the new checkin time;
            const lastCheckIn = user.attendance[user.attendance.length - 1];
            const lastCheckInTimestamp = lastCheckIn.date.getTime();
            // console.log(Date.now(), lastCheckInTimestamp);
            if (Date.now() > lastCheckInTimestamp + 100) {
                user.attendance.push(data);
                await user.save();
                req.flash('success', 'You have been signed in for today');  
            } else {
                res.send('You have signed in today already')

                req.flash("error", "You have signed in today already");
            }
        } else {
            user.attendance.push(data);
            await user.save();
            req.flash('success', 'You have been signed in for today');
        }

    } catch (error) {
        console.log("something went wrong");
        console.log(error);
    }
});
//check out
router.post("/:id/exit", async (req, res) => {
    // the attendance than can be checked out must be last entry in the attendance array
    try {
        const user = await User.findOne({ _id: req.params.id });

        //check if there is an attendance entry
        if (user.attendance && user.attendance.length > 0) {

            //check whether the exit time of the last element of the attedance entry has a value
            const lastAttendance = user.attendance[user.attendance.length - 1];
            if (lastAttendance.exit.time) {
                res.send('You have already signed out today')
                req.flash('error', 'You have already signed out today');
                return;
            }
            lastAttendance.exit.time = Date.now();
            lastAttendance.exit.exitType = req.body.exitType;
            console.log("reason",req.body.exitType )
            await user.save();
            req.flash('success', 'You have been successfully signed out')

        } else { //if no entry
            req.flash('error', 'You do not have an attendance entry ');
        }
    } catch (error) {
        console.log('Cannot find User');
    }
});


const userExists = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (user) {
        return true;
    }
    else {
        return false;

    }
}


module.exports = router;