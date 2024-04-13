import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A book must have a name'],
      unique: true,
    },
    author: {
      type: String,
      required: [true, 'A book must have an author'],
    },
    genre: {
      type: String,
      required: [true, 'A book must have a genre'],
    },
    price: {
      type: Number,
      required: [true, 'A book must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
    publisher: {
      name: String,
      publishedData: Date,
    },
    pageCount: {
      type: Number,
      required: [true, 'A book must have a page count'],
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A book must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'A book must have a language'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)
const Book = mongoose.model('Book', bookSchema)

export default Book
