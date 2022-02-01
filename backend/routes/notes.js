const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Get all Notes fetching using GET: "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const allnotes = await Notes.find({user: req.user.id});
        res.send(allnotes);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a note using POST: "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be atleast 5 characters required').isLength({ min: 5 }),
    body('description', 'Description must be atleast 5 characters required').isLength({ min: 5 }),
],
   async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {title, description, tag} = req.body;
    try {
        // Create a new note
        const note = new Notes({user: req.user.id, title, description, tag})
        const savenote = await note.save();
        res.json(savenote);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }        
},
)

// ROUTE 3: Update an existing Note using PUT: "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Title must be atleast 5 characters required').isLength({ min: 5 }),
    body('description', 'Description must be atleast 5 characters required').isLength({ min: 5 }),
],
   async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {title, description, tag} = req.body;
    
    // Create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    try {
        // Find the note to be update and update it
        const note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send('Not Found');
        }
        
        // Allow updation only if user owns this Note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        // Update an existing note
        const updateNote = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json(updateNote);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }        
},
)

// ROUTE 4: Delete a Note using DELETE: "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and Delete it
        const note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send('Not Found');
        }

        // Allow delation only if user owns this Note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        // Delete a Note
        const deletenote = await Notes.findByIdAndDelete(req.params.id);
        res.status(200).json({"Success": "Note Deleted Successfully"});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }        
},
)

module.exports = router;