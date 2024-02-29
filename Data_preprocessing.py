# -*- coding: utf-8 -*-
"""
Created on Thu Jan 25 21:41:06 2024

@author: Nada
"""

#OceanShipLogbooks

#Includes
import pandas as pd
import requests
import json
from datetime import datetime
from collections import defaultdict
from geojson import Feature, FeatureCollection, LineString, MultiLineString
from shapely.geometry import MultiLineString, shape, Point
from shapely.ops import transform, affinity
from functools import partial
from pyproj import Transformer
import geopandas as gpd
import numpy as np




#Data preprocessing


def data_info(csv_file_path):
    df = pd.read_csv(csv_file_path, low_memory=False)
    print(df.info())    





def filter_data(csv_file_path, threshold_null, threshold_zero, threshold_unknown):
    df = pd.read_csv(csv_file_path, low_memory=False)
    null_threshold = int(threshold_null * len(df))
    df = df.dropna(axis=1, thresh=null_threshold)
    df = df.loc[:, (df.eq(0).sum(axis=0) / len(df)) < threshold_zero]
    df = df.loc[:, (df.eq("Unknown").sum(axis=0) / len(df)) < threshold_unknown]
    df = df.dropna(subset=["Lat3","Lon3"])
    df['VoyageFrom'] = df['VoyageFrom'].str.strip().str.lower().str.capitalize()
    df['VoyageTo'] = df['VoyageTo'].str.strip().str.lower().str.capitalize()
    df['ShipName'] = df['ShipName'].str.strip().str.lower().str.capitalize()
    df.to_csv('output_file.csv', index=False)
    




def csv_to_geojson(csv_file):
    df = pd.read_csv(csv_file, low_memory=False)
    features = []

    for index, row in df.iterrows():
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [row['Lon3'], row['Lat3']]
            }
        }
        for column in df.columns:
            feature["properties"][column] = row[column]
        features.append(feature)   
    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }
    with open('output_file.geojson', 'w') as gjfile:
        json.dump(geojson_data, gjfile, indent=4)
        
        
        
        
        
def point_to_line():
    with open('output_file.geojson', encoding='utf8') as f:
        data = json.load(f)
    routes = defaultdict(lambda: defaultdict(list))
    invalid_voyage_inis = set()  
    for feature in data['features']:
        voyage_ini = feature['properties'].get('VoyageIni') 
        ship_name = feature['properties'].get('ShipName') 
        if voyage_ini and ship_name:
            try:
                date = datetime(feature['properties']['Year'], feature['properties']['Month'], feature['properties']['Day'])
                routes[voyage_ini][ship_name].append((feature, date))
            except ValueError:
                print("Invalid date for feature:", feature)
                invalid_voyage_inis.add(voyage_ini)
    all_features = []
    for voyage_ini, ship_routes in routes.items():
        if voyage_ini in invalid_voyage_inis:
            continue  
        for ship_name, features_with_date in ship_routes.items():
            sorted_features = [feature[0] for feature in sorted(features_with_date, key=lambda x: x[1])]
            if not sorted_features:
                continue 
            coordinates = []
            first_properties = sorted_features[0]['properties']
            for feature in sorted_features:
                coordinates.append(feature['geometry']['coordinates'])
            line_string = LineString(coordinates)
            all_features.append(Feature(geometry=line_string, properties=first_properties))
    all_routes_feature_collection = FeatureCollection(all_features)
    with open('all_routes.geojson', 'w') as f:
        json.dump(all_routes_feature_collection, f)
        
        
        
        
        
def filter_roads(input_file, output_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    features = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'LineString':
            coordinates = feature['geometry']['coordinates']
            if len(coordinates) > 2 and len(set(map(tuple, coordinates))) == len(coordinates):
                features.append(feature)
        else:
            features.append(feature)
    data['features'] = features
    with open(output_file, 'w') as f:
        json.dump(data, f)





def get_disjoint_features(first_geojson_path, second_geojson_path):
    first_gdf = gpd.read_file(first_geojson_path)
    second_gdf = gpd.read_file(second_geojson_path)
    disjoint_features = first_gdf[
        ~first_gdf.intersects(second_gdf.unary_union)
    ]
    disjoint_features_geojson = disjoint_features.__geo_interface__
    with open('disjoint_routes.geojson', 'w') as f:
        json.dump(disjoint_features_geojson, f)
        
        
        

def departure_points(input_geojson_file, output_geojson_file):
    with open(input_geojson_file, 'r') as f:
        data = json.load(f)
    point_features = []
    for feature in data['features']:
        multiline = shape(feature['geometry'])
        if multiline.geom_type == 'MultiLineString':
            for line in multiline:
                if line.coords:
                    point = Point(line.coords[0])
                    new_feature = Feature(geometry=point, properties=feature['properties'])
                    point_features.append(new_feature)
        elif multiline.geom_type == 'LineString':
            if multiline.coords:
                point = Point(multiline.coords[0])
                new_feature = Feature(geometry=point, properties=feature['properties'])
                point_features.append(new_feature)
    point_feature_collection = FeatureCollection(point_features)
    with open(output_geojson_file, 'w') as f:
        json.dump(point_feature_collection, f)
        
        
        
        
def filtered_points():
    with open('disjoint_routes.geojson', encoding='utf8') as lines_file:
        lines_data = json.load(lines_file)
    
    with open('output_file.geojson', encoding='utf8') as points_file:
        points_data = json.load(points_file)
    
    voyage_ini_values = set(feature['properties']['VoyageIni'] for feature in lines_data['features'] if 'VoyageIni' in feature['properties'])
    filtered_points_features = [feature for feature in points_data['features'] if 'VoyageIni' in feature['properties'] 
                                and feature['properties']['VoyageIni'] in voyage_ini_values]
    filtered_points_geojson = {
        "type": "FeatureCollection",
        "features": filtered_points_features
    }
    with open('filtered_points.geojson', 'w') as output_file:
        json.dump(filtered_points_geojson, output_file)     
        
        
        
        
        
def split_geojson(geojson_file, output_prefix):
    with open(geojson_file, encoding='utf-8') as f:
        data = json.load(f)

    features = data['features']
    total_features = len(features)
    features_per_file = total_features // 6

    for i in range(6):
        start_index = i * features_per_file
        end_index = start_index + features_per_file
        if i == 5: 
            end_index = total_features
        output_features = features[start_index:end_index]
        output_features = replace_nan(output_features)
        
        output_data = FeatureCollection(output_features)
        output_filename = f"{output_prefix}{i + 1}.geojson"
        
        with open(output_filename, 'w') as f_out:
            f_out.write(dumps(output_data, indent=2))  
            

def replace_nan(features):
    for feature in features:
        properties = feature.get('properties', {})
        for key, value in properties.items():
            if isinstance(value, float) and value != value:
                feature['properties'][key] = 'NaN'
        geometry = feature.get('geometry', {})
        if geometry.get('type') == 'Point':
            coordinates = geometry.get('coordinates')
            for i, coord in enumerate(coordinates):
                if isinstance(coord, float) and coord != coord:
                    feature['geometry']['coordinates'][i] = 'NaN'
    return features
        


def main():
    data_info('CLIWOC15.csv')
    filter_data('CLIWOC15.csv', 0.8, 0.8, 0.8)
    data_info('output_file.csv')
    csv_to_geojson('output_file.geojson')
    point_to_line()
    filter_roads('all_routes.geojson','filtered_roads.geojson')
    get_disjoint_features('filtered_roads.geojson','world_continents.geojson')
    departure_points('disjoint_routes.geojson','start.geojson')
    filtered_points()
    split_geojson('filtered_points.geojson','point')
    












