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
    const leaves= {
        leaveType:req.body.leaveType,
        remainingLeaves:req.body.remainingLeaves,
        totalLeaves:req.body.totalLeaves,
        appliedLeaves:req.body.appliedLeaves
    };
    User.updateOne(
        { _id: id },{ $set:  leaves}, { new: true }, function (err, article) {
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