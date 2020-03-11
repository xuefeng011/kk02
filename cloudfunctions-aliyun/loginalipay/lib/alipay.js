"use strict";
/**
 * @author tudou527
 * @email [tudou527@gmail.com]
*/
Object.defineProperty(exports, "__esModule", { value: true });

function isfunction(source){
    
    return  Object.prototype.toString.call(source).indexOf("Function")>-1;

}

const crypto = require("crypto");
const urllib = require("./urllib");
const camelcaseKeys = require("./camelcase-keys");
const util_1 = require("./util");
// const pkg = require('../package.json');
class AlipaySdk {
    constructor(config) {
        if (!config.appId) {
            throw Error('config.appId is required');
        }
        if (!config.privateKey) {
            throw Error('config.privateKey is required');
        }
        const privateKeyType = config.keyType === 'PKCS8' ? 'PRIVATE KEY' : 'RSA PRIVATE KEY';
        config.privateKey = this.formatKey(config.privateKey, privateKeyType);
        if (config.alipayPublicKey) {
            config.alipayPublicKey = this.formatKey(config.alipayPublicKey, 'PUBLIC KEY');
        }
        this.config = Object.assign({
            urllib,
            gateway: 'https://openapi.alipay.com/gateway.do',
            timeout: 5000,
            camelcase: true,
            signType: 'RSA2',
            charset: 'utf-8',
            version: '1.0',
        }, camelcaseKeys(config, { deep: true }));
        this.sdkVersion = `alipay-sdk-nodejs-123`;
    }
    // 格式化 key
    formatKey(key, type) {
        const item = key.split('\n').map(val => val.trim());
        // 删除包含 `RSA PRIVATE KEY / PUBLIC KEY` 等字样的第一行
        if (item[0].includes(type)) {
            item.shift();
        }
        // 删除包含 `RSA PRIVATE KEY / PUBLIC KEY` 等字样的最后一行
        if (item[item.length - 1].includes(type)) {
            item.pop();
        }
        return `-----BEGIN ${type}-----\n${item.join('')}\n-----END ${type}-----`;
    }
    // 格式化请求 url（按规范把某些固定的参数放入 url）
    formatUrl(url, params) {
        let requestUrl = url;
        // 需要放在 url 中的参数列表
        const urlArgs = [
            'app_id', 'method', 'format', 'charset',
            'sign_type', 'sign', 'timestamp', 'version',
            'notify_url', 'return_url', 'auth_token', 'app_auth_token',
        ];
        for (const key in params) {
            if (urlArgs.indexOf(key) > -1) {
                const val = encodeURIComponent(params[key]);
                requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${key}=${val}`;
                // 删除 postData 中对应的数据
                delete params[key];
            }
        }
        return { execParams: params, url: requestUrl };
    }
 

    /**
     *
     * @param originStr 开放平台返回的原始字符串
     * @param responseKey xx_response 方法名 key
     */
    getSignStr(originStr, responseKey) {
        // 待签名的字符串
        let validateStr = originStr.trim();
        // 找到 xxx_response 开始的位置
        const startIndex = originStr.indexOf(`${responseKey}"`);
        // 找到最后一个 “"sign"” 字符串的位置（避免）
        const lastIndex = originStr.lastIndexOf('"sign"');
        /**
         * 删除 xxx_response 及之前的字符串
         * 假设原始字符串为
         *  {"xxx_response":{"code":"10000"},"sign":"jumSvxTKwn24G5sAIN"}
         * 删除后变为
         *  :{"code":"10000"},"sign":"jumSvxTKwn24G5sAIN"}
         */
        validateStr = validateStr.substr(startIndex + responseKey.length + 1);
        /**
         * 删除最后一个 "sign" 及之后的字符串
         * 删除后变为
         *  :{"code":"10000"},
         * {} 之间就是待验签的字符串
         */
        validateStr = validateStr.substr(0, lastIndex);
        // 删除第一个 { 之前的任何字符
        validateStr = validateStr.replace(/^[^{]*{/g, '{');
        // 删除最后一个 } 之后的任何字符
        validateStr = validateStr.replace(/\}([^}]*)$/g, '}');
        return validateStr;
    }
    /**
     * 执行请求
     * @param {string} method 调用接口方法名，比如 alipay.ebpp.bill.add
     * @param {object} params 请求参数
     * @param {object} params.bizContent 业务请求参数
     * @param {Boolean} option 选项
     * @param {Boolean} option.validateSign 是否验签
     * @param {object} args.log 可选日志记录对象
     * @return {Promise} 请求执行结果
     */
    exec(method, params = {}, option = {}) {
        
        const config = this.config;
        // 计算签名
        const signData = util_1.sign(method, params, config);
        const { url, execParams } = this.formatUrl(config.gateway, signData);
        const infoLog = (option.log && isfunction(option.log.info)) ? option.log.info : null;
        const errorLog = (option.log && isfunction(option.log.error)) ? option.log.error : null;
        infoLog && infoLog('[AlipaySdk]start exec, url: %s, method: %s, params: %s', url, method, JSON.stringify(execParams));
        return new Promise((resolve, reject) => {
            config.urllib.request(url, {
                method: 'POST',
                data: execParams,
                // 按 text 返回（为了验签）
                dataType: 'text',
                timeout: config.timeout,
                headers: { 'user-agent': this.sdkVersion },
            })
                .then((ret) => {
                infoLog && infoLog('[AlipaySdk]exec response: %s', ret);
                if (ret.status === 200) {
                    /**
                     * 示例响应格式
                     * {"alipay_trade_precreate_response":
                     *  {"code": "10000","msg": "Success","out_trade_no": "111111","qr_code": "https:\/\/"},
                     *  "sign": "abcde="
                     * }
                     * 或者
                     * {"error_response":
                     *  {"code":"40002","msg":"Invalid Arguments","sub_code":"isv.code-invalid","sub_msg":"授权码code无效"},
                     * }
                     */
                    const result = JSON.parse(ret.data);
                    const responseKey = `${method.replace(/\./g, '_')}_response`;
                    const data = result[responseKey];
                    if (data) {
                        // 按字符串验签
                        const validateSuccess = option.validateSign ? this.checkResponseSign(ret.data, responseKey) : true;
                        if (validateSuccess) {
                            resolve(config.camelcase ? camelcaseKeys(data, { deep: true }) : data);
                        }
                        else {
                            reject({ serverResult: ret, errorMessage: '[AlipaySdk]验签失败' });
                        }
                    }
                    reject({ serverResult: ret, errorMessage: '[AlipaySdk]HTTP 请求错误' });
                }
                reject({ serverResult: ret, errorMessage: '[AlipaySdk]HTTP 请求错误' });
            })
                .catch((err) => {
                err.message = '[AlipaySdk]exec error';
                errorLog && errorLog(err);
                reject(err);
            });
        });
    }
    // 结果验签
    checkResponseSign(signStr, responseKey) {
        if (!this.config.alipayPublicKey || this.config.alipayPublicKey === '') {
            console.warn('config.alipayPublicKey is empty');
            // 支付宝公钥不存在时不做验签
            return true;
        }
        // 带验签的参数不存在时返回失败
        if (!signStr) {
            return false;
        }
        // 根据服务端返回的结果截取需要验签的目标字符串
        const validateStr = this.getSignStr(signStr, responseKey);
        // 服务端返回的签名
        const serverSign = JSON.parse(signStr).sign;
        // 参数存在，并且是正常的结果（不包含 sub_code）时才验签
        const verifier = crypto.createVerify(util_1.ALIPAY_ALGORITHM_MAPPING[this.config.signType]);
        verifier.update(validateStr, 'utf8');
        return verifier.verify(this.config.alipayPublicKey, serverSign, 'base64');
    }

}
exports.default = AlipaySdk;
//# sourceMappingURL=alipay.js.map