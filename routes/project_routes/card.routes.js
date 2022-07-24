const router = require("express").Router();
const mongoose = require('mongoose');

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
router.post('/:projectId/card/new-card', (req, res) => {
    console.log(req.body)
    const projectId = req.params.projectId;
    const {title, description, color, stat} = req.body;
    console.log("BODY: ", req.body)

    Card.create({
        title: title, 
        description: description, 
        stat: stat,
        project: projectId,
        color: color
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

router.delete('/card/delete/:id', (req, res) => {
    const taskId  = req.params.id;
    console.log(taskId)

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Card.findByIdAndRemove(taskId)
        .then(() =>
        res.json({
            message: `Project with ${projectId} is removed successfully.`,
        })
        )
        .catch((error) => res.json(error));
})

router.get('/card/edit/:id', (req, res) => {
    const taskId = req.params.id;

    Card.findById(taskId)
        .then((taskResponse) => {
            console.log(taskResponse)
            res.status(200).json(taskResponse);
        })
        .catch((error) => res.json(error));
})




module.exports = router;