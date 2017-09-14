import config from '../../config.json';
import { getNodeEnv } from '../../util';

const countlyConfig = config.countly;
const NODE_ENV = getNodeEnv();
const countlySdkUrl = countlyConfig.sdk[NODE_ENV];
const countlyUrl = countlyConfig.url[NODE_ENV];
const countlyAppKey = countlyConfig.appKey[NODE_ENV];

global.Countly = global.Countly || {};
global.Countly.q = global.Countly.q || [];

export default class CountlyManager {
  static init() {
    // load countly script asynchronously
    // provide countly initialization parameters
    global.Countly.q.push(['track_sessions']);
    global.Countly.q.push(['track_pageview']);
    global.Countly.q.push(['track_clicks']);
    global.Countly.q.push(['track_errors']);
    global.Countly.q.push(['track_links']);
    global.Countly.q.push(['track_forms']);
    global.Countly.q.push(['collect_from_forms']);

    global.Countly.app_key = countlyAppKey;
    global.Countly.url = countlyUrl;
    const cly = document.createElement('script');
    cly.type = 'text/javascript';
    cly.async = true;
    // enter url of script here
    cly.src = `${countlySdkUrl}`;

    let retry = 0;
    cly.onload = () => {
      let initCountly = () => {
        if (typeof global.Countly.init !== 'function') {
          setTimeout(initCountly, 250);

          // everytime we try to init countly, dont forget to increase the retry counter
          retry += 1;

          if (retry > 40) {
            // clear this interval function after 40 retries, that is, 10s
            initCountly = null;
            throw new Error('Countly cannot be initialized, it seems that you are in terrible a network.');
          }
        } else {
          global.Countly.init();
        }
      };

      initCountly();
    };
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(cly, s);
  }
}
