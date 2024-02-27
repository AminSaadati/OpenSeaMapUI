import Map from 'ol/Map';
import OSM, { ATTRIBUTION } from 'ol/source/OSM';
import View from 'ol/View';
import { Projection, fromLonLat } from 'ol/proj';
import { transform } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import { Circle } from 'ol/geom';
import { circular } from 'ol/geom/Polygon';
import Control from 'ol/control/Control';
import { Fill } from 'ol/style';
import { Stroke } from 'ol/style'; 

var default_coords = [53.161436, 26.132631];
let model = { time: 12, vesselId: '' };

var list = [
    'pink_navigation.8533cfa7.png',
    'red_navigation.636f322c.png',
    'blue_navigation.7166a7b0.png',
    'grey_navigation.9a1e2eb4.png',
    'orange_navigation.7a44ed6d.png'
]
var openCycleMapLayer = new TileLayer({
    source: new OSM({
        attributions: [
            'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
            ATTRIBUTION,
        ] //,
        //     url:
        //       'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
        //       '?apikey=Your API key from https://www.thunderforest.com/docs/apikeys/ here',
    }),
});
var openSeaMapLayer = new TileLayer({
    source: new OSM({
        attributions: [
            'All maps © <a href="https://www.openseamap.org/">OpenSeaMap</a>',
            ATTRIBUTION,
        ],
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
        //url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    }),
});
var map = new Map({
    layers: [openCycleMapLayer, openSeaMapLayer],
    target: 'map',
    view: new View({
        maxZoom: 25,
        center: fromLonLat(default_coords),
        zoom: 7
    })
}); 

//#region > APIs


const apiUrl_GetAllForPmoAisByHour = process.env.apiUrl_GetAllForPmoAisByHour;
const apiUrl_GetAisToken = process.env.apiUrl_GetAisToken;

// fetch(apiUrl_GetAllVesselCoordinate)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(userData => {
//         console.log('User Data:', userData);
//         vectorFunc(userData, map);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

async function VesselByHours(model) {
    var data = { time: model.time, vesselId: model.vesselId, token: localStorage.getItem("TokenValue") };
    result.textContent = "Loading data for " + model.time + " hours ...";
    fetch(apiUrl_GetAllForPmoAisByHour, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {

            // console.log('User Data:', userData);
            vectorFunc(userData, map);
            result.textContent = model.time + ' hours selected.' + ' Loaded successfully';
        })
        .catch(error => {
            result.textContent = 'Failed to load';
            console.error('Error:', error);
        });
}

async function getToken() {
    var data = { userNameOrEmailAddress: "pmo_ais", password: "T$52GP4c(@y+Ancw" };
    fetch(apiUrl_GetAisToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {

            localStorage.removeItem("TokenValue");
            localStorage.setItem("TokenValue", userData.result.accessToken);
            model.time = 12;
            VesselByHours(model)
            // vectorFunc(userData, map);
        })
        .catch(error => {

            console.error('Error:', error);
        });
}
getToken();
//#endregion

// 3 Layer = >  all location style and icon and point
// const feauter = new Feature({
//     geometry: new Point(fromLonLat(coords)),
//     name: 'ناو آمریکایی',
// });

// const iconStyle = new Style({
//     image: new Icon({
//         // anchor: [0.5, 46],
//         // anchorXUnits: 'fraction',
//         // anchorYUnits: 'pixels',

//         //anchor: [0.5, 1],
//         src: '../data/red_navigation.png',
//         //  src: 'https://openlayers.org/en/latest/examples/data/icon.png' 
//     }),
// });

// feauter.setStyle(
//     new Style({
//         image: new Icon({
//             // anchor: [0.5, 46],
//             anchorXUnits: 'fraction',
//             anchorYUnits: 'pixels',

//             anchor: [0.5, 1],
//             //src: '../red_navigation.636f322c.png',
//             //  src: '../blue_navigation.7166a7b0.png',
//             src: '../grey_navigation.9a1e2eb4.png',
//             // src: '../orange_navigation.7a44ed6d.png',

//             //// src: '../pink_navigation.8533cfa7.png',
//             // //  src: '../yellow_navigation.0939a596.png',


//             //  src: 'https://openlayers.org/en/latest/examples/data/icon.png' 
//         }),
//     })
// );
// const _source = new VectorSource({
//     features: [feauter],
// });
// const vectorLayer = new VectorLayer({
//     source: _source,
// });  

// 4 layer  => crreating map 
// const map = new Map({
//     layers: [openCycleMapLayer, openSeaMapLayer, vectorLayer],
//     target: 'map',
//     view: new View({
//         maxZoom: 25,
//         center: fromLonLat(coords),
//         zoom: 6
//     })
// });



//#region 2 step  =>  Click to zoom on the specefic location  
const circleFeature = new Feature({
    geometry: new Circle(fromLonLat(default_coords), 50),
});

circleFeature.setStyle(
    new Style({
        renderer(coordinates, state) {
            const [[x, y], [x1, y1]] = coordinates;
            const ctx = state.context;
            const dx = x1 - x;
            const dy = y1 - y;
            const radius = Math.sqrt(dx * dx + dy * dy);

            const innerRadius = 0;
            const outerRadius = radius * 1.4;

            const gradient = ctx.createRadialGradient(
                x,
                y,
                innerRadius,
                x,
                y,
                outerRadius
            );
            gradient.addColorStop(0, 'rgba(255,0,0,0)');
            gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
            gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
            ctx.strokeStyle = 'rgba(255,0,0,1)';
            ctx.stroke();
        },
    })
);


var vectorsource = new VectorSource();
vectorsource.clear(true);
vectorsource.addFeatures([
    new Feature(new Point(fromLonLat(default_coords)))]
);
vectorsource.addFeature(new Feature(circleFeature));
//#endregion







//#region Functions

//#region Func 1

const element = document.getElementById('popup');

const popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
});
map.addOverlay(popup);
let popover;
function disposePopover() {
    if (popover) {
        popover.dispose();
        popover = undefined;
    }
}
// display popup on click
map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    disposePopover();
    if (!feature) {
        return;
    }
    popup.setPosition(evt.coordinate);



    //    var _coords= feature.getGeometry().getCoordinates()
    //    console.log(_coords)
    //     default_coords = _coords
    popover = new bootstrap.Popover(element, {
        placement: 'top',
        html: true,
        content: feature.get('name'),
    });
    popover.show();
});


map.on('pointermove', showInfo);

const info = document.getElementById('info');
function showInfo(event) {
    const features = map.getFeaturesAtPixel(event.pixel);
    if (features.length == 0) {
        info.innerText = '';
        info.style.opacity = 0;
        return;
    }
    const properties = features[0].getProperties();
    var PropertiesModel = {
        VesselName: properties.VesselName,
        MMSI: properties.MMSI,
        ShipType: properties.ShipType,
        IMO: properties.IMO,
        Longitude: properties.Longitude,
        Latitude: properties.Latitude
    };
    info.innerText = JSON.stringify(PropertiesModel, null, 2);
    info.style.opacity = 1;
}

// change mouse cursor when over marker

map.on('pointermove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getViewport().style.cursor = hit ? 'pointer' : '';
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);


const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';
locate.addEventListener('click', function () {
    if (!vectorsource.isEmpty()) {
        map.getView().fit(vectorsource.getExtent(), {
            maxZoom: 15,
            duration: 500,
        });
    }
});
map.addControl(
    new Control({
        element: locate,
    })
);
//#endregion

//#region Func 2 => vectorFunc


function vectorFunc(data, map) {
    var feauter = new Feature();
    var _source = new VectorSource();
    var vectorLayer = new VectorLayer();
    for (var i = 0; i < data.result.length; i++) {
        var tip = "Name :" + data.result[i].vesselName;
        feauter = new Feature({
            geometry: new Point(fromLonLat([data.result[i].aisData[0].longitude, data.result[i].aisData[0].latitude])),
            tip: tip,
            VesselName: data.result[i].vesselName,
            MMSI: data.result[i].mmsi,
            ShipType: data.result[i].shipType,
            IMO: data.result[i].imoNumber,
            Longitude: data.result[i].aisData[0].longitude,
            Latitude: data.result[i].aisData[0].latitude


        });
        var item = list[Math.floor(Math.random() * list.length)];
        feauter.setStyle(
            new Style({
                image: new Icon({
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    anchor: [0.5, 1],
                    src: '../' + item,
                }),
            })
        );
        _source.addFeature(feauter);
    }
    vectorLayer = new VectorLayer({
        source: _source,
    });
    map.addLayer(vectorLayer);
}
//#endregion

//#region Func 3 => DropDown Or ComboBox

const selectElement = document.querySelector(".timeReq");
const result = document.querySelector(".result");

selectElement.addEventListener("change", (event) => {

    model.time = event.target.value;
    VesselByHours(model);

});
//#endregion

//#endregion Functions

