
import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[];
      router?: any;
      lineOptions?: {
        styles?: { color?: string; weight?: number; opacity?: number }[];
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      };
      collapsible?: boolean;
      show?: boolean;
      addWaypoints?: boolean;
      routeWhileDragging?: boolean;
      fitSelectedRoutes?: boolean;
      showAlternatives?: boolean;
      createMarker?: (i: number, wp: Waypoint, n: number) => L.Marker | null;
    }

    interface Waypoint {
      latLng: L.LatLng;
      name?: string;
    }

    class Control extends L.Control {
      constructor(options: RoutingControlOptions);
      on(event: string, fn: () => void): this;
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: L.LatLng[]): this;
    }

    function control(options: RoutingControlOptions): Control;

    interface OsrmV1Options {
      serviceUrl?: string;
      profile?: string;
    }

    function osrmv1(options?: OsrmV1Options): any;
  }
}