import { useEffect, useState } from 'react';
import axios from 'axios';
import InfoIcon from './icons/InfoIcon';
import FireIcon from './icons/FireIcon';
import MoveIcon from './icons/MoveIcon';
import moment from 'moment';
import config from './config.json';
import './App.css';

const formatDate = (date) => {
  return  moment(date).format('L').slice(0, -5)
}

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [forBurningQuantity, setForBurningQuantity] = useState(0);
  const [dateBurning, setDateBurning] = useState(formatDate(Date.now()));

  const headers = { 'AccessKey': config.ACCESS_KEY };

  useEffect(() => {
    axios
      .post(
        `${config.ACCESS_TOKEN_ENDPOINT}/api/${config.API_VERSION}/clients/accesstoken`,
        {
          "idClient": config.CLIENT_ID,
          "accessToken": "",
          "paramName": "device",
          "paramValue": config.DEVICE_ID,
          "latitude": 0,
          "longitude": 0,
          "sourceQuery": 0
        },
        {
          headers: headers,
        }
      )
      .then(res => setAccessToken(res.data.accessToken))
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(
          `${config.BONUS_ENDPOINT}/api/${config.API_VERSION}/ibonus/generalinfo/${accessToken}`,
          {
            headers: headers,
          }
        )
        .then(res => {
          const {currentQuantity,dateBurning, forBurningQuantity} = res.data.data;
          setCurrentQuantity(currentQuantity);
          setForBurningQuantity(forBurningQuantity);
          setDateBurning(formatDate(dateBurning));
        })
        .catch(e => console.log(e));
    }
  }, [accessToken]);

  return (
    <div>
      <header>
        <div className='Logo'>
          ЛОГОТИП
        </div>
        <InfoIcon className='InfoIcon'/>
      </header>
      <div className='Rectangle' />
      <div className='BonusContainer'>
        <div className='Bonus'>{currentQuantity} бонусов</div>
        <div className='BonusExpires'>{dateBurning} сгорит <FireIcon/> {forBurningQuantity} бонусов</div>
        <MoveIcon className='MoveIcon'/>
      </div>
    </div>
  );
}

export default App;
