# connect to mariadb database

import mysql.connector

cnx = mysql.connector.connect(host='TOTO', user='TOTO', password='TOTO', database='TOTO')


def get_station_by_area():
    # Regroup all stations in close area
    cursor = cnx.cursor()
    cursor.execute("SELECT *, COUNT(*) AS nb FROM `2023-3-8_details_stations` AS ds GROUP BY ds.latitude, "
                   "ds.longitude HAVING nb > 1;")
    data = [dict(zip(cursor.column_names, row)) for row in cursor.fetchall()]
    cursor.close()
    return data


def get_station_by_cp():
    # Regroup all stations in close area
    cursor = cnx.cursor()
    cursor.execute(
        "SELECT cp, ville, COUNT(*) AS nb FROM `2023-3-8_details_stations` AS ds GROUP BY cp, ville HAVING nb > 1 ORDER BY cp, nb ASC;")
    data = []

    for row in [dict(zip(cursor.column_names, row)) for row in cursor]:
        if any(s['cp'] <= row['cp'] < s['cp'] + 1000 for s in data):
            for s in data:
                if row['cp'] >= s['cp'] and row['cp'] < s['cp'] + 1000:
                    s['nb'] = s['nb'] + row['nb']

                    if s['cp'] == row['cp']:
                        s['ville'] = row['ville']
        else:
            strA = '000'
            if len(str(row['cp'])) < 5:
                strA = '00'

            data.append(
                dict(zip(['ville', 'cp', 'nb'], [row['ville'], int(str(row['cp'])[:2] + strA), int(row['nb'])])))

    print(data)
    cursor.close()
    return data


def get_station_by_dep():
    # Regroup all stations departement (2 first number of cp)
    cursor = cnx.cursor()
    cursor.execute(
        "SELECT cp, COUNT(*) AS nb FROM `2023-3-8_details_stations` AS ds GROUP BY cp, ville HAVING nb > 1 ORDER BY cp, nb ASC;")

    return sort_by_deps(cursor)


def get_station_by_city():
    # Regroup all stations in ville
    cursor = cnx.cursor()
    cursor.execute("SELECT * , COUNT(*) AS nb FROM `2023-3-8_details_stations` AS ds GROUP BY "
                   "ds.ville HAVING nb > 1;")
    data = [dict(zip(cursor.column_names, row)) for row in cursor.fetchall()]
    cursor.close()
    return data


def get_all_station():
    # Get all stations
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM `2023-3-8_details_stations` AS ds;")
    data = [dict(zip(cursor.column_names, row)) for row in cursor.fetchall()]
    cursor.close()
    return data


def get_closed_stations(date, end):
    # Get all stations closed between date and end
    cursor = cnx.cursor()
    cursor.execute(
        "SELECT *, COUNT(*) AS nb FROM `2023-3-8_fermetures_stations` as `fs` INNER JOIN `2023-3-8_details_stations` as `ds` ON fs.id_pompe = ds.id_pompe WHERE fs.id_pompe != 0 GROUP BY cp, ville HAVING nb > 1 ORDER BY cp, nb ASC;")
    return sort_by_deps(cursor)


def sort_by_deps(cursor):
    data = []

    for row in [dict(zip(cursor.column_names, row)) for row in cursor]:
        # Check if nb exist
        dep = str(str(row['cp'])[:2])
        if len(str(row['cp'])) == 4:
            dep = str('0' + str(row['cp'])[:1])

        if any(s['dep'] == dep for s in data):
            for s in data:
                if s['dep'] == dep:
                    if 'nb' in row:
                        s['nb'] = s['nb'] + row['nb']
        else:
            if 'nb' in row:
                zip_names = ['dep', 'nb']
                zip_rows = [str(dep), int(row['nb'])]
            else:
                zip_names = ['dep']
                zip_rows = [str(dep)]

            zip_names.extend(cursor.column_names)
            zip_rows.extend(row.values())
            data.append(dict(zip(zip_names, zip_rows)))

    return data


def request(query):
    cursor = cnx.cursor()
    cursor.execute(query)
    data = [dict(zip(cursor.column_names, row)) for row in cursor.fetchall()]
    cursor.close()
    return data

def request_cursor(query):
    cursor = cnx.cursor()
    cursor.execute(query)
    return cursor


# export all functions
__all__ = ['get_station_by_area', 'get_station_by_cp', 'get_station_by_city', 'get_all_station', 'request', 'get_station_by_dep', 'get_closed_stations', 'sort_by_deps', 'request_cursor']
