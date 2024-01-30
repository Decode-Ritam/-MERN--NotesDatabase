const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require('../modles/Note')
const { body, validationResult } = require('express-validator');


//Route:1  Get All The Notes usihg:GET "localhost:5000/api/notes/fetchallnotes" . loging required.

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")

    }
})

//Route:2 Add a new note using:POST "localhost:5000/api/notes/addnote" . loging required.
router.post('/addnote', fetchuser,
    [
        body('title', 'Title must be 3 character').isLength({ min: 3 }),
        body('description', 'Description must be 5 character ').isLength({ min: 5 }),
        body('tag', ' Tag must be 3 character').isLength({ min: 3 })
    ],
    async (req, res) => {

        // If therer errors, return bad  request and the errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body
        try {
            const note = new Note({

                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save()
            res.json(saveNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error")

        }
    })

//Route:3 Updating this exsisting note using:PUT "localhost:5000/api/notes/updatanote" . loging required.
router.put('/updatanote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body

    try {
        // Create a new note object
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Fiend the note to be updatet and update it

        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")

    }


})

//Route:4 Deleting this exsisting note using:DELEATE "localhost:5000/api/notes/deleataenote" . loging required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
     try {
         // Fiend the note to be deletet and delet it
         let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found");
        }
        // Allow deletions if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id );

        res.json({ "Sucess":"Success Note has been deleted successfully",note:note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")

    }


})

module.exports = router