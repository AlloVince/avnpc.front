export default class HttpClient {
  static async requestRestAPI(...args) {
    let response = null;
    let json = null;
    try {
      response = await fetch(...args);
      json = await response.json();
      if (response.status > 300 && response.status < 500) {
        throw Error(json.message);
      }
      if (response.status >= 500) {
        throw Error('Server hang up');
      }
    } catch (e) {
      throw e;
    }
    return json;
  }
}