const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const inquirySchema = new Schema(
    {
        fullName: String,
        category: [{ type: Schema.Types.ObjectId, ref: "Job" }],
        where: String,
        when: String,
        description: String
    }
);

module.exports = model('Inquiry', inquirySchema);