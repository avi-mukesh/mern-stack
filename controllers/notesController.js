const Note = require("../models/Note")
const User = require("../models/User")
const asyncHandler = require("express-async-handler")

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length)
        return res.status(400).json({ message: "No notes found" })

    // simply adding username to each note before sending the response
    // could also use a for...of loop
    // https://www.youtube.com/watch?v=4lqJBBEpjRE for Promise.all with map()

    // what's happening here is that map returns an array of promises to resolve
    // and then await Promise.all() resolves all these promises at once
    const notesWithUser = await Promise.all(
        notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec()
            return { ...note, username: user.username }
        })
    )

    res.json(notesWithUser)
})

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body
    if (!user || !title || !text)
        return res.status(400).json({ message: "All fields are required" })

    const duplicate = await Note.findOne({ user, title }).lean().exec()
    if (duplicate)
        return res.status(409).json({ message: "Duplicate note title" })

    // create and store the new note
    const note = await Note.create({ user, title, text })

    if (note) return res.status(201).json({ message: "New note created" })

    res.status(400).json({ message: "Invalid note data received" })
})

// @desc Update note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" })
    }

    const note = await Note.findById(id).exec()
    if (!note) return res.status(400).json({ message: "Note not found" })

    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title" })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()
    res.json(`${updatedNote.title} updated`)
})

// @desc Delete note
// @route Delete /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) return res.status(400).json({ messaage: "Note id required" })

    const note = Note.findById(id).exec()
    if (!note) return res.status(400).json({ message: "Note not found" })

    const result = await note.deleteOne()
    const reply = `Note ${result.title} with id ${result._id} deleted`

    res.json(reply)
})

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote }
