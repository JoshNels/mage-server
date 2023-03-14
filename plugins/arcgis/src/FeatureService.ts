import { LayerInfo } from "./LayerInfo";
import { FeatureServiceResult} from "./FeatureServiceResult";
import { HttpClient } from "./HttpClient";
import { FeatureServiceConfig } from "./ArcGISConfig";

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
     */
    constructor(console: Console) {
        this._httpClient = new HttpClient(console);
        this._console = console;
    }

    /**
     * Queries an arc feature service.
     * @param featureServiceConfig The feature service.
     * @param callback Function to call once response has been received and parsed.
     */
    queryFeatureService(featureServiceConfig: FeatureServiceConfig, callback: (featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig) => void) {
        this._httpClient.sendGetHandleResponse(featureServiceConfig.url + '?f=json', this.parseFeatureService(featureServiceConfig, callback))
    }

    /**
     * Parses the response from the feature service request and sends to the callback.
     * @param featureServiceConfig The feature service.
     * @param callback The callback to call and send the feature service to.
     */
    private parseFeatureService(featureServiceConfig: FeatureServiceConfig, callback: (featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig) => void) {
        return (chunk: any) => {
            this._console.log('Feature Service request. url: ' + featureServiceConfig.url + ', response: ' + chunk)
            const service = JSON.parse(chunk) as FeatureServiceResult
            callback(service, featureServiceConfig)
        }
    }

    /**
     * Queries an arc feature layer to get info on the layer.
     * @param url The url to the arc feature layer.
     * @param events The events configured to sync to the specified arc feature layer.
     * @param infoCallback Function to call once response has been received and parsed.
     */
    queryLayerInfo(url: string, events: string[], infoCallback: (layerInfo: LayerInfo) => void) {
        this._httpClient.sendGetHandleResponse(url + '?f=json', this.parseLayerInfo(url, events, infoCallback));
    }

    /**
     * Parses the response from the request and sends the layer info to the callback.
     * @param url The url to the feature layer.
     * @param events The events configured to sync to the specified arc feature layer.
     * @param infoCallback The callback to call and send the layer info to.
     */
    private parseLayerInfo(url: string, events: string[], infoCallback: (layerInfo: LayerInfo) => void) {
        return (chunk: any) => {
            const info: LayerInfo = Object.assign(new LayerInfo(), JSON.parse(chunk));
            info.initialize(url, events);
            this._console.log('Query layer response for ' + url + ' geometryType: ' + info.geometryType);
            infoCallback(info);
        }
    }
}