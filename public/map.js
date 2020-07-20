mapboxgl.accessToken =
  "pk.eyJ1IjoidmlyYXRrb2hsaTE4IiwiYSI6ImNrY3IxMnFqZDAxZmsyem80cGVmdzhpc2sifQ.RTZmcEmMDCGcanbFSAglIw";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 1,
});
const url = "https://www.trackcorona.live/api/countries";
updateStatus();
function updateStatus() {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((rsp) => {
      rsp.data.forEach((element) => {
        const latitude = element.latitude;
        const longitude = element.longitude;
        if (element.confirmed > 50000) {
          color = "red";
        } else {
          color = "green";
        }
        const marker = new mapboxgl.Marker({
          color: color,
        })
          .setLngLat([longitude, latitude])
          .addTo(map);
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });
        const markerDiv = marker.getElement();
        markerDiv.addEventListener("mouseenter", function () {
          popup
            .setLngLat([longitude, latitude])
            .setHTML(
              "<h3>Confirmed cases in " +
                element.location +
                " " +
                "</h3>" +
                element.confirmed
            )
            .addTo(map);
        });
        markerDiv.addEventListener("mouseleave", function () {
          popup.remove();
        });
      });
    });
}
setInterval(updateStatus, 3600000);
