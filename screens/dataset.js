export const getDataset = async () => {
  try {
    const dataset = await fetch(
      "https://parisdata.opendatasoft.com/explore/dataset/coronavirus-port-du-masque-obligatoire-lieux-places-et-marches/download/?format=geojson&timezone=Europe/Berlin&lang=fr",
      {
        cache: "force-cache",
      }
    );
    if (dataset.status >= 200 && dataset.status <= 204) return dataset.json();
    throw "Dataset not downloaded";
  } catch (err) {
    console.log("err with getDataset", err);
    return require("./test.json");
  }
};

export const getPolygons = (data) => {
  return data.features.map((f) => f.geometry.coordinates).concat([]);
};
