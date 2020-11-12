/* tslint:disable */
/* eslint-disable */
/**
 * Hyperledger Cactus Plugin - Connector Corda
 * Can perform basic tasks on a Corda ledger
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface DeployContractJarsBadRequestV1Response
 */
export interface DeployContractJarsBadRequestV1Response {
    /**
     * 
     * @type {Array<string>}
     * @memberof DeployContractJarsBadRequestV1Response
     */
    errors: Array<string>;
}
/**
 * 
 * @export
 * @interface DeployContractJarsSuccessV1Response
 */
export interface DeployContractJarsSuccessV1Response {
    /**
     * 
     * @type {Array<string>}
     * @memberof DeployContractJarsSuccessV1Response
     */
    deployedJarFiles: Array<string>;
}
/**
 * 
 * @export
 * @interface DeployContractJarsV1Request
 */
export interface DeployContractJarsV1Request {
    /**
     * 
     * @type {Array<JarFile>}
     * @memberof DeployContractJarsV1Request
     */
    jarFiles: Array<JarFile>;
}
/**
 * 
 * @export
 * @interface JarFile
 */
export interface JarFile {
    [key: string]: object | any;

    /**
     * 
     * @type {string}
     * @memberof JarFile
     */
    filename: string;
    /**
     * 
     * @type {string}
     * @memberof JarFile
     */
    contentBase64: string;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Deploys a set of jar files (Cordapps, e.g. the contracts in Corda speak).
         * @param {DeployContractJarsV1Request} [deployContractJarsV1Request] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cordaDeployContractJarsV1: async (deployContractJarsV1Request?: DeployContractJarsV1Request, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/deploy-contract-jars`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof deployContractJarsV1Request !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(deployContractJarsV1Request !== undefined ? deployContractJarsV1Request : {}) : (deployContractJarsV1Request || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Deploys a set of jar files (Cordapps, e.g. the contracts in Corda speak).
         * @param {DeployContractJarsV1Request} [deployContractJarsV1Request] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cordaDeployContractJarsV1(deployContractJarsV1Request?: DeployContractJarsV1Request, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DeployContractJarsSuccessV1Response>> {
            const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).cordaDeployContractJarsV1(deployContractJarsV1Request, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Deploys a set of jar files (Cordapps, e.g. the contracts in Corda speak).
         * @param {DeployContractJarsV1Request} [deployContractJarsV1Request] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cordaDeployContractJarsV1(deployContractJarsV1Request?: DeployContractJarsV1Request, options?: any): AxiosPromise<DeployContractJarsSuccessV1Response> {
            return DefaultApiFp(configuration).cordaDeployContractJarsV1(deployContractJarsV1Request, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Deploys a set of jar files (Cordapps, e.g. the contracts in Corda speak).
     * @param {DeployContractJarsV1Request} [deployContractJarsV1Request] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public cordaDeployContractJarsV1(deployContractJarsV1Request?: DeployContractJarsV1Request, options?: any) {
        return DefaultApiFp(this.configuration).cordaDeployContractJarsV1(deployContractJarsV1Request, options).then((request) => request(this.axios, this.basePath));
    }
}

