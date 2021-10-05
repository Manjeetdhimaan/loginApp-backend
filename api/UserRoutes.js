const router = require('express').Router();
const { updateOne } = require('../models/User');
const User = require('../models/User');

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
        newUser.save().then(user => {
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
router.put('/update/:id', (req, res)=>{
    let id = req.params.id;
    console.log(id)
    User.findOne({_id:id}, (err, foundedObject)=>{
        if(err){
            console.log(err);
            res.status(500).send();
        }
        else{
            if(!foundedObject){
                res.status(404).send();
            }
            else{
                if(req.body.firstname){
                    foundedObject.firstname = req.body.firstname;
                }
                if(req.body.lastname){
                    foundedObject.lastname = req.body.lastname;
                }
                foundedObject.save((err, updatedObject)=>{
                    if(err){
                        console.log(err)
                        res.status(500).send();
                    }
                    else{
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