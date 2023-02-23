import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Chart } from "react-google-charts";
//import { ITopArtists } from './interfaces';

import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function App() {
    const CLIENT_ID = "1bfc6a0cc6fb46189fa163bf12407c11"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "http://accounts.spotify.com/en/authorize"
    const RESPONSE_TYPE = "token"
    const [token, setToken] = useState("");

    const [searchKey, setSearchKey] = useState("")
  //  const [artists, setArtists] = useState <ITopArtists>[]([]);
    const [artists, setArtists] = useState();

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        //BQB2liS8--85nRIM_edco1wxDFn4Q6AuDqrtWctk9VvJRHOzB_fLah1BzeqIW7ayv3wh6skuzg7re3q49Y_mcEkYE0NelAoJNIcPvuBxgGNZi4RzYhVJkn0fjrGkjshf1BXxpmQ2qrprxZFLMNm_-k63ZzbUkWBQT38V8EreSJERK4nU"
        console.log(token);
        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const topArtists = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {

            //  params: { limit: 50, offset: 0, time_range: 'medium_term' },
            params: {},
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log(data);
       // setArtists(data.items);
        console.log(artists, "Saved ya");
    }



    var dataPoint;
    var total;
    const options = {
        animationEnabled: true,
        title: {
            text: "Sales via Advertisement"
        },
        legend: {
            horizontalAlign: "right",
            verticalAlign: "center",
            reversed: true
        },
        data: [{
            type: "pyramid",
            showInLegend: true,
            legendText: "{label}",
            indexLabel: "{label} - {y}",
            toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
            dataPoints: [
                { label: "Impressions", y: 2850 },
                { label: "Clicked", y: 2150 },
                { label: "Free Downloads", y: 1900 },
                { label: "Purchase", y: 650 },
                { label: "Renewal", y: 250 }
            ]
        }]
    }
    //calculate percentage
    dataPoint = options.data[0].dataPoints;
    total = dataPoint[0].y;
    for (var i = 0; i < dataPoint.length; i++) {
        if (i == 0) {
            options.data[0].dataPoints[i].percentage = 100;
        } else {
            options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
        }
    }


  return (
    <div className="App">
      <header className="App-header">
              <h1>Vanessas Spotify Stats :D </h1>

              <CanvasJSChart options={options}
              /*onRef={ref => this.chart = ref}*/
              />
              {!token ?
                  //https://accounts.spotify.com/en/authorize?response_type=token&redirect_uri=https%3A%2F%2Fdeveloper.spotify.com%2Fcallback&client_id=774b29d4f13844c495f206cafdad9c86&state=f6pkqs
                  <a href={`${AUTH_ENDPOINT}?response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=user-read-currently-playing%20user-top-read`}>Login
                      to Spotify</a>

                 // <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                  //     to Spotify</a>

                  : <button onClick={logout}>Logout</button>}
              {token ? 
                  <button onClick={topArtists}>
                     top artists
                  </button>:""
                  }
      </header>
    </div>
  );
}

export default App;
