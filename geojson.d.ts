declare module "*.geojson" {
  const value: {
    type: "FeatureCollection";
    features: Array<Record<string, unknown>>;
  };
  export default value;
}
