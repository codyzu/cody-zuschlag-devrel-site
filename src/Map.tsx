import {Map as ReactMap, Marker} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const annecy = {longitude: 6.133, latitude: 45.916};

export default function Map() {
  return (
    <ReactMap
      style={{borderRadius: '0.75rem'}}
      mapLib={maplibregl}
      initialViewState={{
        ...annecy,
        zoom: 8,
      }}
      mapStyle="https://api.maptiler.com/maps/basic/style.json?key=qlckteTnKEl9ZBax9Thw"
    >
      <Marker {...annecy} anchor="bottom" />
    </ReactMap>
  );
}
