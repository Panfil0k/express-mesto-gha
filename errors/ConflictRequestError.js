class CONFLICT_REQUEST_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = CONFLICT_REQUEST_ERROR;
