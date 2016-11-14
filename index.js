import express from 'express';
import cors from 'cors';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const app = express();
app.use(cors());

const PCdataURL = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
var PCdata = {};
fetch(PCdataURL)
    .then(async (res) => {
      PCdata = await res.json();
    })
    .catch(err => {
      console.log('Не удалось заполнить данные!', err);
    });

app.use((req, res) => {
  const url = req.originalUrl.replace(/^\//,'').replace(/\/$/,'').split('/');
  if (req.originalUrl === '/') {
    return res.status(200).json(PCdata);
  }
  if (req.originalUrl === '/volumes') {
    return res.status(200).json(getValueFromJSON(PCdata,['volumes']));
  }
  if(url[0] in PCdata) {
    const resValue = getValueFromJSON(PCdata,url);
    if (resValue === '404') {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(resValue);
  }
     
  if (PCdata) {
    return res.status(404).send("Not Found");
  } else {
    return res.status(500).send("500 Internal server error!");
  }
});

app.listen(3000, () => {
  console.log('Task 3A listen port 3000!');
});

function getValueFromJSON(jsonObj, key) {
  var currJSON = jsonObj[key[0]];
  if(key.length > 1){
    for(var ind = 1; ind < key.length; ind++){
      if(currJSON.__proto__.hasOwnProperty(key[ind])||!currJSON.hasOwnProperty(key[ind])) {
        return '404';
      };
      currJSON = currJSON[key[ind]];
    };
  };

  if(key[0] === 'volumes'){
      currJSON = jsonObj['hdd'];    
      var currObj = {};
      if (_.isArray(currJSON)){
        for(var i = 0; i < currJSON.length; i++){
     
          if(currJSON[i]['volume'] in currObj){
            currObj[currJSON[i]['volume']] += +currJSON[i]['size'];
          } else {
            currObj[currJSON[i]['volume']] = +currJSON[i]['size'];
          }
;
        };
      } else {
        currObj[currJSON['volume']] = currObj[currJSON[size]]
      };   
      
      for(var el in currObj){
            currObj[el] += 'B';
          }
      return currObj;
  };
  
  return currJSON;
}

   