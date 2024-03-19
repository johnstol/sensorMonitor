This is the first simple implementation of a backend and frontend service which handles temperature sensors.
There are 2 pages:
  home: shows the latest metric per room. For each room you can see temperature, humidity and sensor's battery level
  room Manager: you can add, edit and remove rooms that have a sensor installed

Currently the database (mongoDB) contains dummy metrics generated via a python script, in future there will be a python script that connects with sensors via bluetooth and writes the metrics to db.
