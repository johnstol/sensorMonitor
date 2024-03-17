import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {backendRootUri} from './index';

let METRICS_URI ='';

const Home = () => {
  METRICS_URI = backendRootUri + '/metrics/';
  const navigate = useNavigate();

  function moveToRoomsMgr() {
    navigate('/rooms');
  };

  return (
    <div>
      <h1 className="link-title" onClick={moveToRoomsMgr}>Rooms</h1>
      <LoadMetricsPerRoom/>
    </div>
  );
};

export default Home;

const  LoadMetricsPerRoom = () => {
  const [latestMetrics, setLatestMetrics] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(METRICS_URI+'roomsWithLatestMetric');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Data: ", data);
      setLatestMetrics(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // Handle the error as needed
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

    return (
      <div>
        {latestMetrics.map(latestMetric => (
            <div key={latestMetric.room}>{roomBox(latestMetric.room, latestMetric.temperature,latestMetric.humidity, latestMetric.battery)}</div>
        ))}
    </div>
    );
}

function roomBox(room, temp, humid, battery) {
  var icon = "fas fa-"+iconMapper(room);
  return (
    <div className="window-container">
      <div className="header-content">
        <span>{room}</span>
        <div className="icon-container-header">
          <i className={icon}></i>
        </div>
      </div>
      <div className="body-content">
        <div className="icon-container">
          <i className="fas fa-thermometer-full"></i>
        </div>
        <div className="data">
          {temp}°C
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-box-humid">
          <div className="icon-container">
            <i className="fas fa-tint"></i>
          </div>
          <div className="data">
            {humid}%
          </div>
        </div>
        <div className="footer-box">
          <div className="icon-container">
            <i className="fas fa-battery-full"></i>
          </div>
          <div className="data">
            {battery}%
          </div>
        </div>
      </div>
    </div>
  );
}

function iconMapper(room) {
  switch (room) {
    case "study":
      return "desktop";
    case "bedroom":
      return "bed";
    case "living room":
      return "couch";
    case "outdoors":
      return "home";
    default:
      return "desktop";
  }
}