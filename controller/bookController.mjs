import Book from '../models/bookModel.mjs'
import AppError from '../utils/appError.mjs'
import ApiFeature from '../utils/apiFeature.mjs'
import catchAsyncErrors from '../utils/catchAsyncErrors.mjs'

/**
 * Get all books.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  // Create a new instance of ApiFeature with the Book model and request query.
  // Apply filter, sort, paginate and fields features to the query.
  const featurs = new ApiFeature(Book.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .fields()

  // Execute the query and get all books.
  const allBooks = await featurs.query

  // Send the response with status, result and data.
  res.status(200).json({
    status: 'success',
    result: allBooks.length,
    data: {
      Books: allBooks,
    },
  })
})

/**
 * Create a new book.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const addBook = catchAsyncErrors(async (req, res, next) => {
  // Create a new book using the request body.
  const newBook = await Book.create(req.body)

  // Send the response with status, result and data.
  res.status(201).json({
    status: 'ok',
    data: newBook,
  })
})


/**
 * Get a book by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const getBook = catchAsyncErrors(async (req, res, next) => {
  // Find a book by its ID.
  const book = await Book.findById(req.params.id)

  // If no book is found, throw an error.
  if (!book) {
    // Throw a new AppError with a specific message and status code.
    return new AppError('There is no book with this ID', 404)
  }

  // Send the response with status, result and data.
  res.status(200).json({
    status: 'ok',
    data: { book },
  })
})

/**
 * Update a book by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const updateBook = catchAsyncErrors(async (req, res, next) => {
  // Find a book by its ID and update it with the request body.
  // The new: true option in the query options returns the updated document.
  // The runValidators option ensures that the document is validated before updating.
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  )

  // Send the response with status, result and data.
  // The updated book is returned in the data property.
  res.status(200).json({
    status: 'ok',
    data: {
      updatedBook,
    },
  })
})


/**
 * Delete a book by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  // Find the book by its ID and delete it.
  // The 'delete' method returns null, and we send a 204 No Content response.
  // The response data is null.

  // This is a void promise, so we just await it.
  await Book.findByIdAndDelete(req.params.id)

  // Send the response with status and data.
  res.status(204).json({
    status: 'ok',
    data: null,
  })
})

