# -*- coding: utf-8 -*-
"""
Created on Thu Jan 25 21:41:06 2024

@author: Nada
"""

#Mini-projet

#Includes
import pandas as pd
import requests
import folium


#Data preprocessing

#1
#This function reads a csv file and prints its information (number of rows, columns...)

def data_info(csv_file_path):
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file_path, low_memory=False)
    print(df.info())    

#2

#This function removes columns where a percentage of the data is either null, unknown, or equals 0. 
#Additionally, it removes rows where coordinates are not specified.

def clean_data(csv_file_path, threshold_null, threshold_zero, threshold_unknown):
    
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file_path, low_memory=False)

    
    # Calculate the threshold for null values
    null_threshold = int(threshold_null * len(df))


    # Drop columns with null values exceeding the threshold
    df = df.dropna(axis=1, thresh=null_threshold)
    
    # Drop columns where the threshhold or more of the values are zeros
    df = df.loc[:, (df.eq(0).sum(axis=0) / len(df)) < threshold_zero]
    
    # Drop columns where the threshhold or more of the values are unknown
    df = df.loc[:, (df.eq("Unknown").sum(axis=0) / len(df)) < threshold_unknown]
    
    # Drop rows with no coordinates
    df = df.dropna(subset=["Lat3","Lon3"])
    
    df['VoyageFrom'] = df['VoyageFrom'].str.strip().str.lower().str.capitalize()
    df['VoyageTo'] = df['VoyageTo'].str.strip().str.lower().str.capitalize()
    
    # Save the modified DataFrame back to a new CSV file or overwrite the existing one
    df.to_csv('output_file.csv', index=False)
    
#3

#This function reads a CSV file, and then creates a new CSV file with all unique values from a specified column, ensuring there are no repetitions.

def get_unique_values(csv_file_path, column):
    
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file_path, low_memory=False)

    #Get all possible values in the specified column
    unique_values = df[column].unique()
    
    #Construct Data frame with column name and the unique values
    unique_df = pd.DataFrame({column: unique_values})
    
    # Save the new DataFrame to a new CSV file or overwrite the existing one
    unique_df.to_csv(f'unique_values_{column}.csv', index=False)

#4

def merge_columns(csv_file_path1, column1, csv_file_path2, column2):
    
    # Read both CSV files into a pandas DataFrame
    df1 = pd.read_csv(csv_file_path1, low_memory=False)
    df2 = pd.read_csv(csv_file_path2, low_memory=False)

    col1= df1[column1].tolist()
    col2= df2[column2].tolist()
    
    df3 = pd.DataFrame({'Merge': col1 + col2})

    df3.to_csv('Merge.csv', index=False) 
    
    get_unique_values('Merge.csv','Merge')

    

#5

#This function reads a csv file that contains a column with addresses and writes for each address the corresponding coordinates using MapBox

def get_coordinates(csv_file_path,address_column):
    
      # Read the CSV file into a pandas DataFrame 
      df = pd.read_csv(csv_file_path, low_memory=False, encoding='latin-1')
      
      #Create two columns 'Latitude' and 'Longitude'
      df['Latitude']=''
      df['Longitude']=''
      
      # Iterate on all addresses
      for index, row in df.iterrows():
          try:
                #Extract address
                location= df.at[index,address_column]
                
                #Connect to Mapbox and request data for location
                MAPBOX_ACCESS_TOKEN = ''   
                base_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
                endpoint = f'{location}.json'
                params = {'access_token': MAPBOX_ACCESS_TOKEN}
                response = requests.get(base_url + endpoint, params=params)
                
                #if the request is successful
                if response.status_code == 200:
                    
                    #Extract data
                    data = response.json()        
                    
                    #Visualize data to find how to access the coordinates
                    #print(data)
                    
                    # Check if features list is not empty
                    if 'features' in data and data['features']:
                        
                        # Extract latitude and longitude from data and save it in the csv columns
                        df.at[index, 'Latitude'] = data['features'][0]['center'][1]
                        df.at[index, 'Longitude'] = data['features'][0]['center'][0] 
                        
          except ValueError:
                pass     
            
      #Overwrite the file with new changes     
      df.to_csv(csv_file_path, index=False, sep=';')
 
#6

#This function reads a csv file that contains two columns with coordinates and writes for each entry the corresponding country using MapBox
    
def get_country(csv_file_path, latitude_column, longitude_column):
    
    # Read the CSV file into a pandas DataFrame 
    df = pd.read_csv(csv_file_path, low_memory=False, encoding='latin-1', sep=';')
    
    #Create a 'Country' column  
    df['Country'] = ''

    # Iterate on all coordinates
    for index, row in df.iterrows():
        try:
            
            #Extract longitude
            lon = float(df.at[index, longitude_column])
            
            #Extract latitude
            lat = float(df.at[index, latitude_column])
            
            #Connect to Mapbox and request data for country name
            MAPBOX_ACCESS_TOKEN = ''
            base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
            endpoint = f"{lon},{lat}.json"  # Note the order of coordinates
            params = {
                'access_token': MAPBOX_ACCESS_TOKEN,
            }
            response = requests.get(base_url + endpoint, params=params)
            
            #if the request is successful
            if response.status_code == 200:
                
                #Extract data
                data = response.json()
                
                #Visualize data to find how to the country name
                #print(data)
                    
                # Check if features list is not empty
            
                if 'features' in data and data['features']:
                        for context in data['features'][0].get('context', []):
                            if context['id'].startswith('country'):
                                
                                #Extract the country name and save it in the country column
                                df.at[index, 'Country'] = context['text']
        except ValueError:
            pass
    
    #Overwrite the file with new changes 
    df.to_csv(csv_file_path, index=False)

#7

def correct_data(csv_file_path, csv_file_path2):
    df = pd.read_csv(csv_file_path, sep=';')
    df2 = pd.read_csv(csv_file_path2, sep=',')
    VoyageFrom=df2['VoyageFrom'].tolist()
    VoyageTo=df2['VoyageTo'].tolist()
    duplicate_locations = df[df.duplicated(['Latitude', 'Longitude'], keep=False)]

    # Display and process cities with duplicate locations
    for _, group in duplicate_locations.groupby(['Latitude', 'Longitude']):
        print("Cities with the same latitude and longitude:")
        cities = group['Merge'].tolist()
        print(cities)

        # Ask the user for a code to replace the city names
        code = input("Enter a code to replace these city names or 0 to skip")
        
        for i in range(len(VoyageFrom)):
            if VoyageFrom[i] in cities:
                if code!=0:
                    VoyageFrom[i]=code
                
        for i in range(len(VoyageTo)):
            if VoyageTo[i] in cities:
                if code!=0:
                    VoyageTo[i]=code
    
    df2['VoyageFrom']=VoyageFrom 
    df2['VoyageTo']=VoyageTo

    # Save the modified DataFrame to a new CSV file
    modified_file_path = csv_file_path2.replace('.csv', '_modified.csv')
    df2.to_csv(modified_file_path, index=False)

    print(f"Modified data saved to: {modified_file_path}")

    

#

#8

#This function reads two csv files with common field values and joins attributes of a specified column

def join_attributes(csv_file_path1,Table_field1, csv_file_path2, Table_field2, field_to_copy, new_field):
    
    # Read both CSV files into a pandas DataFrame 
    df = pd.read_csv(csv_file_path1)
    df2 = pd.read_csv(csv_file_path2, sep=',')

    #Create a "new_field" column in the first csv file (where we will save the new values) 
    df[new_field] = ''
    
    #Convert the "new_field" column into a list
    New = df[new_field].tolist()
    
    #Convert the "Table_Field1" column into a list
    #transform the column values into string data, remove leading and trailing spaces, and convert all the text to lowercase (to make sure values correspond with no issues) 
    field1 = df[Table_field1].str.strip().str.lower().tolist()
    
    #Convert the "Table_Field2" column into a list
    #transform the column values into string data, remove leading and trailing spaces, and convert all the text to lowercase (to make sure values correspond with no issues)
    field2 = df2[Table_field2].str.strip().str.lower().tolist()
    
    #Convert the "field_to_copy" column into a list    
    common_field = df2[field_to_copy].tolist()

    #Join attributes by field value
    for l in range(len(field1)):
        for i in range(len(field2)):
            if field1[l] == field2[i]:
                New[l] = common_field[i]

    # Assign the updated list back to the DataFrame
    df[new_field] = New  

    #Overwrite the file with new changes 
    df.to_csv(csv_file_path1, index=False)
    
#9

#This function reads the original csv file with different points and csv file containing only the unique possible values of Trip_ID.
#Then we specify the column that contains the trip_ID in both csv files
#Then we precise which trips we wanna generate : to run this function only on the first 200 Trip_IDs we put start=0 and end=199

def display_trips(csv_file_path, trip_ID_unique_values_path, column, start, end):

    
    df2 = pd.read_csv(trip_ID_unique_values_path)
    unique_values=df2[column].tolist()
    
    for n in range(start, end):
            m = folium.Map((48.85381285231611, 2.3449980166801163), zoom_start=2)
            output_path= f'sample_data_trip_{n+1}.csv'
            value=float(unique_values[n])
            df = pd.read_csv(csv_file_path, low_memory=False)           
            #Extract rows of specific trip
            df = df.loc[df[column] == value]
            df.to_csv(output_path, index=False)
            
            lon_list = df['Lon3'].tolist()
            lat_list = df['Lat3'].tolist()
            From_list= df['VoyageFrom'].tolist()
            To_list= df['VoyageTo'].tolist()
            Ship_list= df['ShipName'].tolist()
            Trip_list= df['VoyageIni'].tolist()
            
            for i in range (len(lon_list)):
                    folium.Marker(
                        location=(lat_list[i], lon_list[i]),
                        popup="Départ: " + str(From_list[i]) + "\n" + "Destination: " + str(To_list[i]) + "\n" + "Nom du bateau: " + str(Ship_list[i]) + "\n" + "trip: " + str(Trip_list[i]),
                        icon=folium.Icon(color="blue"),
                      ).add_to(m)            
                    
            m.save(f'sample_{n+1}.html')
            
#10
import json
def csv_to_geojson(csv_file):
    df = pd.read_csv(csv_file, low_memory=False)
    features = []

    for index, row in df.iterrows():
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [row['Lon3'], row['Lat3'], 0]  # Reversing order to [longitude, latitude]
            }
        }

        for column in df.columns:
            feature["properties"][column] = row[column]

        features.append(feature)
        

    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }
    
    with open('geo2.geojson', 'w') as gjfile:
        json.dump(geojson_data, gjfile, indent=4)


def main1():
    data_info('CLIWOC15.csv')
    clean_data('CLIWOC15.csv', 0.8, 0.8, 0.8)
    data_info('output_file.csv')
    get_unique_values('output_file.csv', 'VoyageTo')
    get_unique_values('output_file.csv', 'VoyageFrom')
    merge_columns('unique_values_VoyageTo.csv','VoyageTo','unique_values_VoyageFrom.csv','VoyageFrom')
    get_coordinates('unique_values_Merge.csv','Merge')
    correct_data('unique_values_Merge.csv', 'output_file.csv')
#Correct cities
    
def main2():
    get_country('unique_values_Merge.csv','Latitude','Longitude')
    join_attributes('output_file.csv','VoyageFrom','unique_values_Merge.csv','Merge','Country','CountryFrom')
    join_attributes('output_file.csv','VoyageTo','unique_values_Merge.csv','Merge','Country','CountryTo')
    get_unique_values('output_file.csv', 'VoyageIni')
    data_info('unique_values_VoyageIni.csv')    
    display_trips('output_file.csv', 'unique_values_VoyageIni.csv', 'VoyageIni', 2116, 4000)
    

csv_to_geojson('output_file.csv')
