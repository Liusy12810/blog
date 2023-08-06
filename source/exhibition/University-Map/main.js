// 示例地点数据
const locations = [
    { position: [126.978, 37.566], name: "首尔" },
    { position: [139.6917, 35.6895], name: "东京" },
    { position: [-0.1278, 51.5074], name: "伦敦" },
    // 添加更多的地点数据...
];

// 创建一个用于显示地图的容器
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // 使用OpenStreetMap作为底图
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]), // 初始地图中心点，这里选择经纬度(0, 0)的位置
        zoom: 2 // 初始缩放级别
    })
});

// 添加地点数据
for (const location of locations) {
    const [x, y] = location.position;
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([x, y]))
    });

    marker.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: 'https://openlayers.org/en/v6.1.1/examples/data/icon.png' // 可替换为你自己的图标
        })
    }));

    marker.setProperties({ name: location.name });

    const vectorSource = new ol.source.Vector({
        features: [marker]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    map.addLayer(vectorLayer);
}

// 创建一个Overlay用于显示地点名称
const overlay = new ol.Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false
});
map.addOverlay(overlay);

// 监听鼠标移动事件来显示地点名称
map.on('pointermove', (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinates);
        const name = feature.getProperties().name;
        overlay.getElement().innerHTML = `<strong>${name}</strong>`;
    } else {
        overlay.setPosition(undefined);
    }
});
