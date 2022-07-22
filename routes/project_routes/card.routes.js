const router = require("express").Router();

const Card = require("../../models/Card.model");

/**
 * Ruta para recuperar todas las targetas de un poroyecto
 */
router.get('/card/get-cards', (req, res) => {

    Card.find()
    .then((allCards) => {
        console.log(allCards)
        res.status(200).json(allCards)
    })
    .catch(err => res.status(400).json(err));
});


/**
 * Ruta para crear una nueva targeta dentro de un proyecto
 */
router.post('/card/new-card', (req, res) => {

    const {title, description, stat} = req.body;

    Card.create({
        title: title, 
        description: description, 
        stat: stat
    })
    .then((newCardResponse) => {
        res.status(200).json(newCardResponse)
    })
    .catch(err =>  res.status(400).json(err));
});

router.put('/card/updateCard/:id/:stat', (req, res) => {

    Card.findByIdAndUpdate(req.params.id, {    
        stat: req.params.stat.toUpperCase()
    })
    .then((cardUpdated) => {

        res.status(200).json(cardUpdated);
    })
    .catch(err => res.json(err))

});




module.exports = router;