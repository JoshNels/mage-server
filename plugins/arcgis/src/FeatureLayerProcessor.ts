import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObjects } from "./ArcObjects";
import { ArcObservation } from "./ArcObservation";
import { LayerInfo } from "./LayerInfo";
import { ObservationBinner } from "./ObservationBinner";
import { ObservationBins } from "./ObservationBins";
import { ObservationsSender } from "./ObservationsSender";

export class FeatureLayerProcessor {

    /**
     * Information about the arc feature layer this class sends observations to.
     */
    private _layerInfo: LayerInfo;

    /**
     * Bins the observations into updates and adds.
     */
    private _binner: ObservationBinner;

    /**
     * Sends the observation adds or updates to the arc feature layer.
     */
    private _sender: ObservationsSender;

    /**
     * Constructor.
     * @param layerInfo Information about the arc feature layer this class sends observations to.
     * @param config Contains certain parameters that can be configured.
     * @param console Used to log messages to the console.
     */
    constructor(layerInfo: LayerInfo, config: ArcGISPluginConfig, console: Console) {
        this._layerInfo = layerInfo;
        this._binner = new ObservationBinner(layerInfo.url, config.observationIdField, console);
        this._sender = new ObservationsSender(layerInfo.url, config.attachmentModifiedTolerance, console);
    }

    /**
     * Checks to see if there are any updates that need to be sent to the feature layer.
     */
    processPendingUpdates() {
        const bins = this._binner.pendingUpdates();
        this.send(bins);
    }

    /**
     * Goes through each observation and figures out if the geometry type matches the arc feature layer.
     * If so it then seperates the adds from the updates and sends them to the arc feature layer.
     * @param observations 
     */
    processArcObjects(observations: ArcObjects) {
        const arcObjectsForLayer = new ArcObjects();
        for (const arcObservation of observations.observations) {
            if (this._layerInfo.geometryType == arcObservation.object.geometry.esriGeometryType) {
                arcObjectsForLayer.add(arcObservation);
            }
        }

        const bins = this._binner.sortEmOut(arcObjectsForLayer);
        this.send(bins);
    }

    /**
     * Sends all the observations to the arc server.
     * @param bins The observations to send.
     */
    private send(bins: ObservationBins) {
        if (!bins.adds.isEmpty()) {
            this._sender.sendAdds(bins.adds);
        }
        if (!bins.updates.isEmpty()) {
            this._sender.sendUpdates(bins.updates);
        }
    }
}