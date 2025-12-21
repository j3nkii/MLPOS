class MPLOSerr extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.name = 'MLPOSerr';
    this.customErr = true;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
    this.message = message;
  }
}


module.exports = {
  MPLOSerr
};