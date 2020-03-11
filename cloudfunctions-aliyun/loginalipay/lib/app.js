var AlipaySdk = require("./alipay").default;

console.log("start 1111 ========>");

const AlipaySdkConfig = {
  "appId": "2021001129648682",
  "privateKey": `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQJlE77hh4IbYvcaSIQItCKqkj3+Ze2GjPuLDc/YiVgyIs0PywOgHq0/HOoR3xQhQ9z2dzExBwelorNRylnfRDZ5C3XerzCUcmSekFMOW0FUNk296C6gZafu493Nu6VteZUmvQYe667xpbPWdDtm8+hnv4TVrIIvsUtG19kJGk/cBKXm4gqhjneQHyTxGt3nNC7p3mzvywT1KnpJ0c0QbZuk9nqyQQzQxpCAef2EXA+U8get4PWvfnwxW4Z0VTrlIvAXgeOFBpunWudF3KN80/uRxA2sNlE6+bKwAgo1yzYy+3j08HeoWnYi/EMvSKO/9z83ee1u5BTWR0SkJ7Qj01AgMBAAECggEAXCYSkhQf0lQCqguk2XEhVNf+ri9IjmMbhYaUkYEF2kYtB6dFkcZTSXHZx3SZtou+ctDuWdLbFHwyviJCwODbsGc5TO8d7eWFdUWUT7w1a0yYe5ZOhTPjgeBYnnVchZ9UTfAxedHREfEd0SvMoq2yKa9A+rdAjGZISbEZuUY8xNJ27FmrT+GK3KkQ18ubB0rgHTIOhEmJvuaWbaVtzrOZlT7O3S5usgkSfLW/AruYmTj/FsodiJKhFDRCVx2LLxbmMbTDhQGgy1Q7AcBxxFPmSnVdPd6ApjFwTey6cO9l78hTaRm9daYvJbE6xDbs1rRqoVZyv1TXfwCHp1VfLN28tQKBgQDXcLczSbVvqwKLlJf3+TDN+Eg+lBeg87++K10NG+qd3/0qJIhZFoXo2XnkTjOjRZbGKFcxMrxQRgX2iyMgrKzFWZaA1CTBvhcQjxLPig5JfxSuBhNGG2RGMAkxLdnkijwi+iPoRFVuVPZVsPY/vFc1ShawLIuOANIY8XAVww3F7wKBgQCrSbRIseiWmQ5JiLlyq1xASlyVYwfub2OedNZ6gxUB0ZvUkq5HQayvtOz7IIwqii/iEWlEExHNsGh1EF05mfjJMhvFt1ZtBrcfse1B1w0XQ6XRyvub4pHaKU81EDEXnqAlkgix4fAdO0jaqLbkTCXJApiEnGquY1LYcFMz2VxzGwKBgAqaAFnkwanqF2j4+fV47L7l/eAed38zH3djOOQBQK1eLV4aiB8iLZrEwOvMMVxSe1Xq/EdugLfOilKUjDj6ZlIb030pc1mZWhc1gy51U7ioKUNbBy3HAUs25+zknblSWB08g/HVEwMn6StUVvnR8dSsfatTtdZaEfyqPOLFQ3M/AoGAGw2uEtk+oiKUdhrJJ4pXLLRSASo+A3PGaS2M/pabh8kCcsWkDw8ZZjsOPu+6E7H1tCAJ3z2fzzvwk6S9BK8D80sdxdGaLegknjXtAjwkDiuaEhOcP9e+L5Xcs8XV6yQbqTNyeh30XbmSXS7OjCpWwXPOgQtvchGv8Q10prjK+EcCgYBag1Ppf5/jwLF3rJBCDCKN47Sg+gTqGyGnkrSA65IL0qorO/6UEQOf+hehNB/aK8f1g26yliI/yGdyjM+mu3EChMcvu5sBesw+o9I5FHoRU4nuxHjlrLFwecaedbw82zf7Jj++YpvLZriGkxvOtIUhWAzqN43YLIdvNSgJIOkXxw==`,
};
console.log("start 2 ========>");

let alipaySdk=null;
try{
 alipaySdk = new AlipaySdk(AlipaySdkConfig);

}catch(e){
  console.log("init error ========>",e);
}

console.log("start 3 ========>");
 
class aliplayApi {
  /**
   * 获取accToken
   * @param {obj} param0 
   */
  static async accToken({ code }) {
    console.log("code ========>", code);
    try {
      let params = {
        grantType: 'authorization_code',
        code,
      };
      let options = {};
      let r1 = await alipaySdk.exec("alipay.system.oauth.token", params, options);
      return r1;
    }
    catch (e) {
      console.log("code error=========>",e);
    }
  }
  /**
   * 获取用户信息
   * @param {obj} param0 
   */
  static async userInfo({ accessToken }) {
    console.log("accessToken ========>", accessToken);
    try {
      let params = {
        auth_token: accessToken
      };
      let options = {};
      let r1 = await alipaySdk.exec("alipay.user.info.share", params, options);
      return r1;
    }
    catch (e) {
      console.log("accessToken error=========>",e);
    }
  }
};
 
module.exports = aliplayApi;