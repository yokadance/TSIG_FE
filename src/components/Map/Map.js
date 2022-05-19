import { useEffect, useState, useRef } from "react";
import { fromLonLat } from "ol/proj";
import {
  FullScreen,
  ZoomSlider,
  defaults as defaultControls,
} from "ol/control";
import { OSM, BingMaps, Stamen, XYZ, TileWMS as TileWMSSource } from "ol/source";
import { Group as LayerGroup, Tile as TileLayer } from "ol/layer";
import LayerSwitcher from "ol-layerswitcher";
import OlMap from "ol/Map";
import OlView from "ol/View";
import "ol/ol.css";
import "./Map.scss";
import "ol-layerswitcher/src/ol-layerswitcher.css";

const Map = ({ returnRef = null }) => {
  const [map, setMap] = useState(null);
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  useEffect(() => {
    if (!map) {
      const mapTemp = new OlMap({
        target: mapElement.current,
        controls: defaultControls().extend([
          new FullScreen(),
          new ZoomSlider(),
          // new LayerSwitcher(),
        ]),
        view: new OlView({
          //Montevideo
          center: fromLonLat([-56.18816, -34.90328]),
          zoom: 11,
          minZoom: 2,
          maxZoom: 18,
        }),
        layers: [
          new LayerGroup({
            title: "Main Layers",
            combine: false,
            visible: true,
            layers: [
              new TileLayer({
                title: "OSM",
                type: "base",
                visible: true,
                source: new OSM(),
              }),
              new TileLayer({
                opacity: 0.6,
                source: new TileWMSSource({
                  url: 'http://localhost:8080/geoserver/wms',
                  params: {
                    layers: 'tsig:ft_00_departamento',
                    'TILED': true,

                  },
                  projection: 'EPSG:32721'

                }),
                name: 'Uruguay'
              }),


            ],
          }),
        ],
      });

      setTimeout(() => {
        mapTemp.updateSize();
      }, 0);

      setMap(mapTemp);
      if (typeof returnRef === "function") returnRef(mapTemp);
    }
  }, []);

  return (
    <div ref={mapElement} className="map">
      <div id="popup-container">
        <div id="popup-content">
          <div id="popup-text"></div>
        </div>
      </div>

      <div id="tooltip-container">
        <div id="tooltip-content"></div>
      </div>
    </div>
  );
};

export default Map;
