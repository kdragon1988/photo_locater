"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

/**
 * 写真の位置情報を表示するGoogle Mapsコンポーネント
 */
export function Map({ photos }: { photos: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 35.6812, lng: 139.7671 }, // 東京
          zoom: 12,
          mapTypeId: "roadmap",
          mapTypeControl: false,
          streetViewControl: false,
        });

        setMap(map);
      }
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    // 既存のマーカーを削除
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // 写真の位置にマーカーを配置
    photos.forEach((photo) => {
      if (photo.latitude && photo.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: photo.latitude, lng: photo.longitude },
          map,
          icon: {
            url: photo.url,
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        // カメラの向きを示す矢印を追加
        if (photo.heading) {
          const heading = photo.heading;
          const arrow = new google.maps.Marker({
            position: { lat: photo.latitude, lng: photo.longitude },
            map,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              rotation: heading,
              fillColor: "#FF0000",
              fillOpacity: 1,
              strokeColor: "#FF0000",
              strokeWeight: 1,
            },
          });
          newMarkers.push(arrow);
        }

        // クリック時の情報ウィンドウ
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <img src="${photo.url}" alt="写真" class="w-32 h-32 object-cover mb-2" />
              <p class="text-sm">撮影日時: ${new Date(
                photo.takenAt
              ).toLocaleString()}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);

    // すべての写真が表示されるように地図の範囲を調整
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition()!);
      });
      map.fitBounds(bounds);
    }
  }, [map, photos]);

  return <div ref={mapRef} className="w-full h-full" />;
} 