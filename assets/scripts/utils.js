info = L.control();
legend = L.control({position: 'bottomright'});
let unit = 'stations'
let unit_title = 'Nombre de stations'

/**
 * Returns a color based on the number of cases
 * @param d {number}
 * @param min {number}
 * @param max {number}
 * @param type {string} Good, bad or neutral
 * @returns {string}
 */
function getColor(d, min, max, type) {
    d = Math.round(d*100)
    min = Math.round(min*100)
    max = Math.round(max*100)
    if (type === 'good') {
        return d === max ? '#006837' :
            d > (max-min) * 0.75+min ? '#1a9850' :
                d > (max-min) * 0.5+min ? '#66bd63' :
                    d > (max-min) * 0.25+min ? '#a6d96a' :
                        d > (max-min) * 0.1+min ? '#d9ef8b' :
                            d > min ? '#ffffbf' :
                                '#f7f7f7';
    } else if (type === 'bad') {
        return d === max ? '#d73027' :
            d > (max-min) * 0.75+min ? '#ef6548' :
                d > (max-min) * 0.5+min ? '#fc8d59' :
                    d > (max-min) * 0.25+min ? '#fdbb84' :
                        d > (max-min) * 0.1+min ? '#fdd49e' :
                            d > min ? '#fef0d9' :
                                '#f7f7f7';
    } else {
        return d === max ? '#000000' :
            d > (max-min) * 0.75+min ? '#252525' :
                d > (max-min) * 0.5+min ? '#525252' :
                    d > (max-min) * 0.25+min ? '#737373' :
                        d > (max-min) * 0.1+min ? '#969696' :
                            d > min ? '#bdbdbd' :
                                '#f7f7f7';
    }
}

/**
 * Returns the style for the map
 * @param feature
 * @returns {{fillColor: string, color: string, fillOpacity: number, weight: number, opacity: number, dashArray: string}}
 */
function style(feature, min, max, type) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.value, min, max, type)
    };
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature.properties);
}

info.onAdd = function (map) {
    // Remove the previous info div
    if (this._div) {
        this._div.remove();
    }
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    const contents = props ? `<b>${props.nom} (${props.code})</b><br />${Math.round(props.value * 100) / 100} ${unit}` : 'Survolez un département';
    this._div.innerHTML = `<h4>${unit_title}:</h4>${contents}`;
};

function updateLegend(min, max, type){
    if(legend._container) {
        legend._container.remove()
    }

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        // divide stations_by_deps.features.value in ten parts
        // Float 2 digits
        const grades = Array.from({length: 10}, (v, i) => Math.round((min + (max - min) * i / 10) * 100) / 100);
        const labels = [];
        let from, to;

        for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(`<i style="background:${getColor(from, min, max, type)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}