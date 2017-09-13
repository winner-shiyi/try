/*
* change moment to string, format YYYY-MM-DD (HH:mm:SS)
* toJSON, use the toISOString, overwrite it
* */
(function () {
  function pad (number) {
    if (number < 10) {
      return '0' + number
    }
    return number
  }

  Date.prototype.toISOString = function () {
    return this.getUTCFullYear() +
      '-' + pad(this.getUTCMonth() + 1) +
      '-' + pad(this.getUTCDate()) +
      ' ' + pad(this.getUTCHours()) +
      ':' + pad(this.getUTCMinutes()) +
      ':' + pad(this.getUTCSeconds())
  }
}())
