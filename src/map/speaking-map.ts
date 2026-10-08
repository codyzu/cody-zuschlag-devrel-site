import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './speaking-map.css';
import {home} from './speaking-locations.ts';

export function initializeSpeakingMap() {
  const container = document.querySelector<HTMLElement>('#speaking-map');
  if (!container) {
    return;
  }

  container.hidden = false;
  const isReducedMotion = globalThis.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const map = L.map(container, {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    zoomAnimation: !isReducedMotion,
    fadeAnimation: !isReducedMotion,
    markerZoomAnimation: !isReducedMotion,
    inertia: !isReducedMotion,
    worldCopyJump: true,
  });
  map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com">Leaflet</a>',
  );
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);

  const bounds = L.latLngBounds([home.coordinates]);
  const addMarker = (
    coordinates: [number, number],
    city: string,
    detail: string,
    isHome = false,
  ) => {
    const label = `${city} · ${detail}`;
    const content = document.createElement('div');
    const heading = document.createElement('strong');
    heading.className = 'map-popup-title';
    heading.textContent = city;
    const description = document.createElement('p');
    description.className = 'map-popup-detail';
    description.textContent = detail;
    content.append(heading, description);
    const marker = L.marker(coordinates, {
      title: label,
      icon: L.divIcon({
        className: isHome
          ? 'speaking-marker speaking-marker-home'
          : 'speaking-marker',
        html: isHome
          ? '<span class="i-lucide-house" aria-hidden="true"></span>'
          : '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
      zIndexOffset: isHome ? 1000 : 0,
    })
      .addTo(map)
      .bindPopup(content);
    marker.getElement()?.setAttribute('aria-label', label);
    bounds.extend(coordinates);
  };

  for (const city of document.querySelectorAll<HTMLElement>(
    '[data-map-city]',
  )) {
    const count = Number(city.dataset.count);
    addMarker(
      [Number(city.dataset.latitude), Number(city.dataset.longitude)],
      city.dataset.location ?? '',
      `${count} speaking ${count === 1 ? 'engagement' : 'engagements'}`,
    );
  }

  addMarker(home.coordinates, home.location, 'Home base', true);
  map.fitBounds(bounds, {padding: [24, 24], maxZoom: 5, animate: false});
  const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize({pan: false});
    map.fitBounds(bounds, {padding: [24, 24], maxZoom: 5, animate: false});
  });
  resizeObserver.observe(container);
  const help = document.querySelector<HTMLElement>('#map-help');
  if (help) {
    help.hidden = false;
  }
}
