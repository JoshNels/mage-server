import { LayerInfoResult} from "./LayerInfoResult";
import { FeatureServiceResult} from "./FeatureServiceResult";
import { HttpClient } from "./HttpClient";
import { FeatureServiceConfig, FeatureLayerConfig } from "./ArcGISConfig";

/**
 * Queries arc feature services and layers.
 */
export class FeatureService {

    /**
     * Used to make the get request about the feature layer.
     */
    private _httpClient: HttpClient;

    /**
     * Used to log messages.
     */
    private _console: Console;

    /**
     * Constructor.
     * @param console Used to log messages. 
     * @param token The access token.
     */
    constructor(console: Console, token?: string) {
        this._httpClient = new HttpClient(console, token);
        this._console = console;
    }

    /**
     * Queries an arc feature service.
     * @param featureServiceConfig The feature service.
     * @param callback Function to call once response has been received and parsed.
     */
    queryFeatureService(featureServiceConfig: FeatureServiceConfig, callback: (featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig) => void) {
        this._httpClient.sendGetHandleResponse(featureServiceConfig.url, this.parseFeatureService(featureServiceConfig, callback))
    }

    /**
     * Parses the response from the feature service request and sends to the callback.
     * @param featureServiceConfig The feature service.
     * @param callback The callback to call and send the feature service to.
     */
    private parseFeatureService(featureServiceConfig: FeatureServiceConfig, callback: (featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig) => void) {
        return (chunk: any) => {
            this._console.log('Feature Service. url: ' + featureServiceConfig.url + ', response: ' + chunk)
            const service = JSON.parse(chunk) as FeatureServiceResult
            callback(service, featureServiceConfig)
        }
    }

    /**
     * Queries an arc feature layer to get info on the layer.
     * @param url The url to the arc feature layer.
     * @param featureLayer The feature layer configuration.
     * @param infoCallback Function to call once response has been received and parsed.
     */
    queryLayerInfo(url: string, featureLayer: FeatureLayerConfig, infoCallback: (url: string, featureLayer: FeatureLayerConfig, layerInfo: LayerInfoResult) => void) {
        this._httpClient.sendGetHandleResponse(url, this.parseLayerInfo(url, featureLayer, infoCallback));
    }

    /**
     * Parses the response from the request and sends the layer info to the callback.
     * @param url The url to the feature layer.
     * @param featureLayer The feature layer configuration.
     * @param infoCallback The callback to call and send the layer info to.
     */
    private parseLayerInfo(url: string, featureLayer: FeatureLayerConfig, infoCallback: (url: string, featureLayer: FeatureLayerConfig, layerInfo: LayerInfoResult) => void) {
        return (chunk: any) => {
            this._console.log('Query Layer. url: ' + url + ', response: ' + chunk)
            const layerInfo = JSON.parse(chunk) as LayerInfoResult
            infoCallback(url, featureLayer, layerInfo)
        }
    }
}