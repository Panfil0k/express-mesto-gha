class REQUEST_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = REQUEST_ERROR;
