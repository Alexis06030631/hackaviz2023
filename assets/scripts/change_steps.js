const steps = {
	intro: {var_name:'stations_by_deps', unit: 'Stations', unit_title: 'Nombre de stations'},
	fermetures: {var_name:'closed_stations', type:'marks', unit: 'Stations', unit_title: 'Stations fermées', popup: 'name', details: null},
	less_cher: {var_name:'less_cher', type:'marks', unit: '€ / L', unit_title: 'Stations les moins chères', popup: 'ville', details: 'moyenne'},
	more_cher: {var_name:'more_cher', type:'marks', unit: '€ / L', unit_title: 'Stations les plus chères', popup: 'ville', details: 'moyenne'},
	prix_avant_augm: {var_name:'moyenne_prix_city', unit: '€ / L', unit_title: 'Prix moyen'},
	prix_apr_augm: {var_name:'prix_apr_augm', unit: '€ / L', unit_title: 'Différence de prix'},
}

/**
 * Change the steps
 * @param {string} step - The step name to change to
 */
function change_steps(step) {
	// Get const with name 'stations_by_deps'
	if(steps[step]) {
		unit = steps[step].unit
		unit_title = steps[step].unit_title
		// Change the map with the data
		const data = window.data[steps[step].var_name]
		if(steps[step].var_name && data && steps[step].type !== 'marks') {
			// define max and min values
			let max = data.features.reduce((acc, feature) => Math.max(acc || 0, feature.properties.value))
			let min = data.features.reduce((acc, feature) => Math.min(acc || 10000, feature.properties.value))


			// Set GeoJSON
			geojson = L.geoJson(data, {
				style: function (feature) {
					return style(feature, min, max, step.includes('prix') ? 'bad' : 'good')
				},
				onEachFeature
			}).addTo(map);

			// Update legend
			updateLegend(min, max, step.includes('prix') ? 'bad' : 'good')
			// Update info
			info.addTo(map)

			if(window.data.initPoint && window.data.initZoom) map.setView(window.data.initPoint, window.data.initZoom, true);
		}else if(steps[step].type === 'marks' && data) {
			data.filter((mark) => mark.latitude !== 'NA').forEach((mark) => {
				let popup = ''
				if(steps[step].popup) popup += mark[steps[step].popup]
				if(steps[step].details) popup += ' : <br>\n\b' + Math.round(mark[steps[step].details]*100)/100 +' €/L'
				window.data.fg.addLayer(L.marker([mark.latitude, mark.longitude])
					.bindPopup(popup))
			})
		}

	}else {
		console.error('Step not found')
	}
}