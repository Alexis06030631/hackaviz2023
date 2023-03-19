const db = require('./database');
const {sort_by_deps, save_to_js, save_marks, moy_by_dep} = require("./utils");

db.then(conn => {
	console.log('Connected to database')
	// MAke a query
	conn.query('SELECT cp, ville, COUNT(*) AS nb FROM `2023-3-8_details_stations` AS ds GROUP BY cp, ville HAVING nb > 1 ORDER BY cp, nb;').then(
		(rows) => {
			save_to_js(sort_by_deps(rows), 'stations_by_deps', '../france/departements.json', 'stations_by_deps')
		}
	)

	// Get closed stations
	conn.query('SELECT latitude,longitude, ville AS name FROM `2023-3-8_fermetures_stations` INNER JOIN `2023-3-8_details_stations` ON `2023-3-8_fermetures_stations`.`id_pompe` = `2023-3-8_details_stations`.`id_pompe` WHERE type = \'D\' AND debut >= 2008/01/01 and debut < 2013').then(
		(rows) => {
			save_marks(rows, 'closed_stations', 'closed_stations')
		}
	)

	// Get Moyenne de prix par ville
	conn.query("SELECT cp, nom_carburant, ville, essence.id_pompe, AVG(prix) as moyenne FROM essence INNER JOIN `2023-3-8_details_stations` ON essence.id_pompe = `2023-3-8_details_stations`.id_pompe WHERE nom_carburant = 'SP98' AND date_maj < 2023/01/01 GROUP BY essence.id_pompe;")
	.then(
		(rows) => {
			save_to_js(moy_by_dep(rows), 'moyenne_prix_city', '../france/departements.json', 'moyenne_prix_city')
			conn.end()
		}
	)


	// Plus grand changement de prix en 1 mois
	conn.query("SELECT essence_mensuel.id_pompe, nom_carburant, mois, AVG(prix_min) as prix_min, AVG(prix_max) as prix_max, AVG(prix_max - prix_min) as moyenne, cp, ville FROM essence_mensuel INNER JOIN `2023-3-8_details_stations` ON essence_mensuel.id_pompe = `2023-3-8_details_stations`.id_pompe WHERE mois = '2022 mars' GROUP BY essence_mensuel.id_pompe, essence_mensuel.nom_carburant, essence_mensuel.mois;")
	.then(
		(rows) => {
			save_to_js(moy_by_dep(rows), 'prix_apr_augm', '../france/departements.json', 'prix_apr_augm')
		}
	)

	// 100 stations les moins chères
	conn.query("SELECT essence.id_pompe, nom_carburant, AVG(prix) as moyenne, cp, ville, latitude, longitude FROM essence INNER JOIN `2023-3-8_details_stations` ON essence.id_pompe = `2023-3-8_details_stations`.id_pompe GROUP BY essence.id_pompe HAVING moyenne >= 0.1 ORDER BY moyenne ASC LIMIT 100;")
	.then(
		(rows) => {
			save_marks(rows, 'less_cher', 'less_cher')
		}
	)

	// 100 stations les plus chères
	conn.query("SELECT essence.id_pompe, nom_carburant, AVG(prix) as moyenne, cp, ville, latitude, longitude FROM essence INNER JOIN `2023-3-8_details_stations` ON essence.id_pompe = `2023-3-8_details_stations`.id_pompe GROUP BY essence.id_pompe HAVING moyenne >= 0.1 ORDER BY moyenne DESC LIMIT 100;")
	.then(
		(rows) => {
			save_marks(rows, 'more_cher', 'more_cher')
		}
	)
})