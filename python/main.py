# import file database.py
import pandas as pd
import folium
import database
import matplotlib.pyplot as plt


def Stations():
    # Make a map of the france with all stations
    map = folium.Map(location=[46.227638, 2.213749], zoom_start=6, tiles='Cartodb Positron')

    # Cartographier la france avec des carrés de 0.1 degrés sur toute la france

    stations = database.get_station_by_dep()
    stations = [[s['dep'], int(s['nb'])] for s in stations]
    # replace '20' by '2A' and '2B'
    for s in stations:
        if s[0] == '20':
            s[0] = '2A'
            stations.append(["2B", s[1]])
    print(stations)
    folium.Choropleth(
        geo_data='../france/departements.json',
        data=stations,
        name='choropleth',
        columns=['ville', 'nb'],
        legend_name='Nombre de stations',
        key_on="feature.properties.code",
        fill_color="YlGn",
        fill_opacity=0.7,
        line_opacity=0.2,
    ).add_to(map)

    map.save('map.html')


def Stations_close():
    # Color scale in red
    # Make a map of the france with all stations
    map = folium.Map(location=[46.227638, 2.213749], zoom_start=6, tiles='Cartodb Positron')

    # Cartographier la france avec des carrés de 0.1 degrés sur toute la france

    stations = database.get_closed_stations('2000-01-01', '2043-12-31')
    print(stations)
    stations = [[s['dep'], int(s['nb'])] for s in stations]
    print(stations)
    folium.Choropleth(
        geo_data='../france/departements.json',
        data=stations,
        name='choropleth',
        columns=['ville', 'nb'],
        legend_name='Nombre de stations',
        key_on="feature.properties.code",
        fill_color="YlOrRd",
        fill_opacity=1,
        color="white",
        nan_fill_color="gray",
        nan_fill_opacity=0.2,
        line_opacity=0,
    ).add_to(map)

    map.save('map.html')


def Graph_evol_prix_essence():
    # Graphique de l'évolution du prix de l'essence
    df = pd.read_csv('prix-essence.csv', sep=';')
    df = df.drop(columns=['Unnamed: 0'])
    df = df.set_index('date')
    df = df.drop(columns=['id_station'])
    df = df.drop(columns=['id_pompe'])
    df = df.drop(columns=['id_prix'])
    df = df.drop(columns=['id_type_carburant'])
    df = df.drop(columns=['id_type_essence'])
    df = df.drop(columns=['id_type_prix'])
    df = df.drop(columns=['id_type_vente'])
    df = df.drop(columns=['id_type_vehicule'])
    df = df.drop(columns=['id_type_station'])
    df = df.drop(columns=['id_type_service'])
    df = df.drop(columns=['id_type_paiement'])
    df = df.drop(columns=['id_type_reseau'])
    df = df.drop(columns=['id_type_carte'])

    df = df.groupby('date').mean()
    df = df.reset_index()
    df = df.set_index('date')
    df = df.drop(columns=['id_station'])
    df = df.drop(columns=['id_pompe'])
    df = df.drop(columns=['id_prix'])
    df = df.drop(columns=['id_type_carburant'])
    df = df.drop(columns=['id_type_essence'])
    df = df.drop(columns=['id_type_prix'])
    df = df.drop(columns=['id_type_vente'])
    df = df.drop(columns=['id_type_vehicule'])
    df = df.drop(columns=['id_type_station'])
    df = df.drop(columns=['id_type_service'])
    df = df.drop(columns=['id_type_paiement'])
    df = df.drop(columns=['id_type_reseau'])

    df = df.drop(columns=['id_type_carte'])



    df.plot()
    plt.show()


def Graph_evol_prix_diesel():
    data = database.request("SELECT * FROM `2023-3-8_prix_stations` WHERE id_pompe = 1000001")

    # Gazoil
    x_gaz = []
    y_gaz = []
    x_sp95 = []
    y_sp95 = []
    x_sp98 = []
    y_sp98 = []
    x_e10 = []
    y_e10 = []
    x_gplc = []
    y_gplc = []
    for d in data:
        if d['nom_carburant'] == 'Gazole':
            x_gaz.append(d['date_maj'][8:10])
            y_gaz.append(d['prix'])
        elif d['nom_carburant'] == 'SP95':
            x_sp95.append(d['date_maj'][8:10])
            y_sp95.append(d['prix'])
        elif d['nom_carburant'] == 'SP98':
            x_sp98.append(d['date_maj'][8:10])
            y_sp98.append(d['prix'])
        elif d['nom_carburant'] == 'E10':
            x_e10.append(d['date_maj'][8:10])
            y_e10.append(d['prix'])
        elif d['nom_carburant'] == 'GPLc':
            x_gplc.append(d['date_maj'][8:10])
            y_gplc.append(d['prix'])

    # plot the graph
    plt.title("Evolution du prix du Gazole le 01/01/2023 et le 01/02/2023")
    plt.plot(x_gaz, y_gaz, color='red', marker='.')
    plt.plot(x_sp95, y_sp95, color='blue', marker='.')
    plt.plot(x_sp98, y_sp98, color='green', marker='.')
    plt.plot(x_e10, y_e10, color='yellow', marker='.')
    plt.show()

#Graph_evol_prix_diesel()

def prix_AVG_dep():
    data = database.sort_by_deps(database.request_cursor('SELECT nom_carburant, semaine, prix_min, prix_moyen, prix_max, cp, AVG(prix_moyen) AS moyenne FROM `essence_hebdomadaire` INNER JOIN `2023-3-8_details_stations` ON essence_hebdomadaire.id_pompe = `2023-3-8_details_stations`.id_pompe GROUP BY essence_hebdomadaire.id_pompe'))
    print(data)

    # Make a map of the france with all stations
    map = folium.Map(location=[46.227638, 2.213749], zoom_start=6, tiles='Cartodb Positron')
    stations = [[s['dep'], s['moyenne']] for s in data]

    folium.Choropleth(
        geo_data='../france/departements.json',
        data=stations,
        name='choropleth',
        columns=['ville', 'nb'],
        legend_name='Nombre de stations',
        key_on="feature.properties.code",
        fill_color="YlOrRd",
        fill_opacity=1,
        color="white",
        nan_fill_color="gray",
        nan_fill_opacity=0.2,
        line_opacity=0,
    ).add_to(map)

    map.save('map.html')


#prix_AVG_dep()


def prix_AVG_dep_Low():
    #SOON
    print("SOON")

def prix_AVG_dep_High():
    #SOON
    print("SOON")


def rupture_stock():
    data = database.sort_by_deps(database.request_cursor(
        'SELECT fs.id_pompe, cp, COUNT(*) as nb FROM `2023-3-8_ruptures_stations` as `fs` INNER JOIN `2023-3-8_details_stations` as `ds` ON fs.id_pompe = ds.id_pompe GROUP BY cp;'))
    print(data)

    # Make a map of the france with all stations
    map = folium.Map(location=[46.227638, 2.213749], zoom_start=6, tiles='Cartodb Positron')
    stations = [[s['dep'], s['nb']] for s in data]

    folium.Choropleth(
        geo_data='../france/departements.json',
        data=stations,
        name='choropleth',
        columns=['ville', 'nb'],
        legend_name='Nombre de stations',
        key_on="feature.properties.code",
        fill_color="YlOrRd",
        fill_opacity=1,
        color="white",
        nan_fill_color="gray",
        nan_fill_opacity=0.2,
        line_opacity=0,
    ).add_to(map)

    map.save('map.html')

prix_AVG_dep()