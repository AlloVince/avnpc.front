import URL from 'url-parse';
import config from '../universal.config';

const urlParams = [
  'protocol',
  'slashes',
  'auth',
  'username',
  'password',
  'host',
  'hostname',
  'port',
  'pathname',
  'query',
  'hash',
  'href',
  'origin'
];

const filterObject = inputObject =>
  Object
    .entries(inputObject)
    .filter(([, value]) => value !== undefined && value !== null)
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

export default class HttpClient {
  static async requestRestAPI(input, init) {
    let response = null;
    let json = null;
    let url = null;
    if (input.url) {
      ({ url } = input);
    } else {
      url = new URL(config.BACKEND_URL);
      urlParams.forEach((p) => {
        if (input[p]) {
          url.set(p, typeof input[p] === 'object' ? filterObject(input[p]) : input[p]);
        }
      });
      url = url.toString();
    }
    try {
      console.log(url)
      response = await fetch(url, Object.assign({
        method: 'GET'
      }, input), init);
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