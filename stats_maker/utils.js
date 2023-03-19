const fs = require('fs')
const path = require('path')
module.exports = {
	sort_by_deps(data) {
		// Sort by department (2 first digits of the postal code) and return an object with the departments an numbers of stations
		let deps = {}
		for (let i = 0; i < data.length; i++) {
			let cp = data[i].cp
			if(cp.length === 4) {
				cp = '0' + cp
			}
			// replace '20' by '2A' and '2B'
			if(cp === '20000') {
				cp = '2A'
			}
			let dep = cp.substring(0, 2)
			if (deps[dep]) {
				deps[dep] += Number(data[i].nb)
			} else {
				deps[dep] =  Number(data[i].nb)
			}
		}
		// copy deps = 2A to deps = 20
		deps['2B'] = deps['2A']
		return deps
	},

	save_to_js(data, filename, json_file, var_name) {
		// Open json_file file
		json_file = require(path.join(__dirname, json_file))
		json_file.features.forEach((feature) => {
			// if data[feature.properties.code] == undefined, destroy the feature
			if(!data[feature.properties.code]) {
				feature.properties.value = 0
				feature.geometry = null
				json_file.features = json_file.features.filter((f) => f.geometry)
			}
			feature.properties.value = data[feature.properties.code] || 0
		})

		// Transform json_file to js file with var_name variable
		json_file = 'window.data.' + var_name + ' = ' + JSON.stringify(json_file)

		// Save to json file
		fs.writeFileSync(path.join(__dirname, '..', 'data_use', filename+'.js'), json_file)
	},

	save_marks(data, filename, var_name) {
		data = 'window.data.' + var_name + ' = ' + JSON.stringify(data)
		fs.writeFileSync(path.join(__dirname, '..', 'data_use', filename+'.js'), data)
	},

	moy_by_dep(data) {
		let deps = {}
		for (let i = 0; i < data.length; i++) {
			let cp = data[i].cp
			if(cp.length === 4) {
				cp = '0' + cp
			}
			// replace '20' by '2A' and '2B'
			if(cp === '20000') {
				cp = '2A'
			}
			let dep = cp.substring(0, 2)
			if (deps[dep]) {
				deps[dep].value += Number(data[i].moyenne)
				deps[dep].nbr += 1
			} else {
				deps[dep] =  {value: Number(data[i].moyenne), nbr: 1}
			}
		}
		// copy deps = 2A to deps = 20
		deps['2B'] = deps['2A']
		for (let dep in deps) {
			console.log(deps[dep].value, deps[dep].nbr)
			deps[dep] = deps[dep].value / deps[dep].nbr
		}
		return deps
	}
}