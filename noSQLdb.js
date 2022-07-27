const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/qanda');

const answerSchema = new mongoose.Schema({
  id: Number,
  body: String,
  date: Date,
  answerer_name: String,
  answerer_email: String,
  helpfulness: Number,
  photos: Array
})

const questionSchema = new mongoose.Schema({
  product_id: Number,
  question_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  asker_email: String,
  question_helpfulness: Number,
  reported: Boolean,
  //embedded subdocument
  answers: [answerSchema]
});

const productSchema = new mongoose.Schema({
  product_id: String,
  // hold a subset of the 5-10 'top' questions as an embedded doc
  //do not put all of them as one product may have many questions down the line that affect performance.
  questions: [questionSchema]

})

const Product = mongoose.model('Product', productSchema);
const Question = mongoose.model('Question', questionSchema);

module.exports.Product = Product;
module.exports.Question = Question;