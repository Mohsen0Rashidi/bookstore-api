/**
 * catchAsyncErrors is a middleware function that catches async errors 
 * thrown by async functions and passes them to the next middleware.
 * 
 * @param {function} fn - The async function to be wrapped.
 * @return {function} - The middleware function that wraps the async function.
 */
export default (fn) => {
  /**
   * The middleware function that wraps the async function.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  return (req, res, next) => {
    /**
     * The async function is called and its promise is awaited. If an error
     * is thrown, it is caught and passed to the next middleware.
     */
    fn(req, res, next).catch(next)
  }
}

