let short1 = {
  name: "tinyHands",
  url:
    "https://www.amazon.com/Daily-Portable-LLC-Hands-HighFive/dp/B07HR8P337/ref=sr_1_2_sspa?dchild=1&keywords=tiny+hands&qid=1632359789&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyQkJUVVlCN1RGVU5JJmVuY3J5cHRlZElkPUEwMTc4OTc3N1ZETFpCR04xRVVTJmVuY3J5cHRlZEFkSWQ9QTAxNTk1ODlBWkIwQ1I5T1hRTzYmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl",
  creator: "Amir",
};

let short2 = {
  name: "rick",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  creator: "Chris",
};

let data = [short1, short2];

/**
 * @typedef Short
 * @prop {string} name - some string, valid in a URL path
 * @prop {string} url - link to an external source
 * @prop {string} creator - username
 */

/**
 * @class Shorts
 *
 * Stores all Shorts. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Shorts {
  /**
   * Add a Short to the collection.
   *
   * @param {string} name - The name of the short
   * @param {string} url - The URL which the short represents
   * @param {string} creator - The creator of the short
   * @return {Short} - the newly created short
   */
  static addOne(name, url, creator = null) {
    const short = { name, url, creator };
    data.push(short);
    return short;
  }

  /**
   * Find a Short by Name.
   *
   * @param {string} name - The name of the short to find
   * @return {Short | undefined} - the found short with above name
   */
  static findOne(name) {
    return data.filter((short) => short.name === name)[0];
  }

  /**
   * @return {Short[]} an array of all of the Shorts
   */
  static findAll() {
    return data;
  }

  /**
   * Update a Short's URL.
   *
   * @param {string} name - The name of the short to update
   * @param {string} url - The new URL to associate with the short
   * @return {Short | undefined} - The updated short
   */
  static updateOne(name, url) {
    const short = Shorts.findOne(name);
    short.url = url;
    return short;
  }

  /**
   * Delete a Short from the collection.
   *
   * @param {string} name - name of Short to delete
   * @return {Short | undefined} - deleted Short
   */
  static deleteOne(name) {
    const short = Shorts.findOne(name);
    data = data.filter((s) => s.name !== name);
    return short;
  }
}

module.exports = Shorts;
