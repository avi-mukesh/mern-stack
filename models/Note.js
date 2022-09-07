const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // object ID from a schema
            ref: "User",
            required: true,
        },
        tile: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: "ticket", //creates a field called "ticket" in noteSchema that gets the sequential number
    id: "ticketNums", //a separate collection called counter will be created in which we will see this id
    start_seq: 500,
})

module.exports = mongoose.model("Note", noteSchema)
