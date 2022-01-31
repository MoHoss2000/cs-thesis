const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thesisSchema = new Schema({
    professor: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    cosupervised: {
        type: String
    },
    major: {
        type: String
    },
    order: {
        type: Number
    }
},
    { timestamps: true })
const Thesis = mongoose.model('Thesis', thesisSchema);
module.exports = Thesis;

