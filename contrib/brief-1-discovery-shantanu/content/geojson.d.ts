declare module "*.geojson" {
  const value: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      id?: string | number;
      properties?: { name?: string };
      geometry?: { type: string; coordinates?: [number, number] };
    }>;
  };
  export default value;
}