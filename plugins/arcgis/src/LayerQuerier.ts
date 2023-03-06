import { LayerInfo } from "./LayerInfo";
import { HttpClient } from "./HttpClient";

/**
 * Queries specific feature layers from and arc server and gather information about it.
 */
export class LayerQuerier {

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
     * Queries an arc feature layer to get info on the layer.
     * @param url The url to the arc feature layer.
     * @param infoCallback Function to call once response has been received and parsed.
     */
    queryLayerInfo(url: string, infoCallback: (layerInfo: LayerInfo) => void) {
        this._httpClient.sendGetHandleResponse(url + '?f=json', this.parseLayerInfo(url, infoCallback));
    }

    /**
     * Parses the response from the request and sends the layer info to the callback.
     * @param url The url to the feature layer.
     * @param infoCallback The callback to call and send the layer info too.
     */
    private parseLayerInfo(url: string, infoCallback: (LayerInfo: LayerInfo) => void) {
        return (chunk: any) => {
            const info: LayerInfo = Object.assign(new LayerInfo(), JSON.parse(chunk));
            info.initialize(url);
            this._console.log('Query layer response for ' + url + ' geometryType: ' + info.geometryType);
            infoCallback(info);
        }
    }
}