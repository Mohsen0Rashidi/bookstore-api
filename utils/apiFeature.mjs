export default class ApiFeature {
  /**
   * ApiFeature class constructor.
   *
   * @param {Object} query - The Mongoose query object.
   * @param {Object} queryString - The query string from the request.
   */
  constructor(query, queryString) {
    /**
     * The Mongoose query object.
     * @type {Object}
     */
    this.query = query

    /**
     * The query string from the request.
     * @type {Object}
     */
    this.queryString = queryString
  }

  /**
   * Filter the query based on the query string.
   * Exclude certain fields from the query string.
   * Convert the query string to a JSON object and apply the
   * filters to the query.
   *
   * @return {Object} The ApiFeature instance.
   */
  filter() {
    // Create a shallow copy of the query string.
    const queryObj = { ...this.queryString }

    // Exclude specific fields from the query string.
    const excludedFields = ['sort', 'limit', 'page', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    // Convert the query string to a JSON string.
    let queryStr = JSON.stringify(queryObj)

    // Replace operators in the JSON string with their corresponding Mongoose operators.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

    // Apply the filters to the query.
    this.query = this.query.find(JSON.parse(queryStr))

    // Return the ApiFeature instance.
    return this
  }

  /**
   * Sort the query based on the query string.
   * If the query string has a 'sort' field, sort the query based on its value.
   * Otherwise, sort the query based on the 'createdAt' field in descending order.
   *
   * @return {Object} The ApiFeature instance.
   */
  sort() {
    // Check if the query string has a 'sort' field.
    if (this.queryString.sort) {
      // Convert the 'sort' field to a space-separated string.
      const sortBy = this.queryString.sort.split(',').join(' ')

      // Sort the query based on the converted string.
      this.query = this.query.sort(sortBy)
    } else {
      // Sort the query based on the 'createdAt' field in descending order.
      this.query = this.query.sort('-createdAt')
    }

    // Return the ApiFeature instance.
    return this
  }

  /**
   * Apply select fields to the query based on the query string.
   * If the query string has a 'fields' field, select the specified fields.
   * Otherwise, select all fields except the '__v' field.
   *
   * @return {Object} The ApiFeature instance.
   */
  fields() {
    // Check if the query string has a 'fields' field.
    if (this.queryString.fields) {
      // Split the 'fields' field by comma and join them with a space.
      const fields = this.queryString.fields.split(',').join(' ')

      // Select the specified fields from the query.
      this.query = this.query.select(fields)
    } else {
      // Select all fields except the '__v' field from the query.
      this.query = this.query.select('-__v')
    }

    // Return the ApiFeature instance.
    return this
  }

  /**
   * Apply pagination to the query based on the query string.
   * If the query string has a 'page' and/or 'limit' field, apply the
   * pagination to the query. Otherwise, do not apply pagination.
   *
   * @return {Object} The ApiFeature instance.
   */
  paginate() {
    // Extract the 'page' and 'limit' fields from the query string.
    // Use the default values if the fields are not present.
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 50

    // Calculate the number of documents to skip based on the page and limit.
    const skip = (page - 1) * limit

    // Apply pagination to the query.
    this.query = this.query.skip(skip).limit(limit)

    // Return the ApiFeature instance.
    return this
  }
}
