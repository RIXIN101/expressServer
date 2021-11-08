//* Подключение библиотек
const config = require('config');
const express = require('express');
const app = express();
const request = require('request');
const bitrix24 = require('./bitrix24');
const TOKEN = config.get('TOKEN');

//* Данные из конфига
const bitrix24Url = config.get('bitrix24Url');
const httpBuildQuery = require("http-build-query");

const PORT = process.env.PORT || 80
function getDealById(id) {
  return new Promise((resolve, reject) => {
    request({
      url: `${bitrix24Url}/crm.deal.get?id=${id}`,
      json: true
    }, (error, response, body) => {
      if (error) reject(error);
      resolve(body);
    });
  });
}


app.get('/success', (req, res) => {
  const reqDealId = req.query;
  console.log(reqDealId);
  request.post({
    url: `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=497394343&text=${reqDealId}`,
    json: true
  }, (error, response, body) => {
      if (error) console.log(error);
      else console.log('Тесты прошли успешно')
  });
  res.end();
  /* getDealById(reqDealId).then(response => {
    const comments = response.result.COMMENTS;
    const chatID = comments.split(" ")[0];
    let companyName = '';
    if (comments.split(' ').length > 2) {
      companyName = comments.split(' ').slice(1).join(' ');
    } else {
      companyName = comments.split(' ')[1];
    }
    console.log(companyName, chatID);
    bitrix24.getCompany(companyName, chatID);
    bitrix24.getContacts(companyName, chatID);
    const updateDealFields = {
      "ID": reqDealId,
      "fields": {
        "OPENED": "N",
        "CLOSED": "Y",
        "STAGE_ID": "WON"
      }
    };
    request({
      url: `${bitrix24Url}/crm.deal.update?${httpBuildQuery(updateDealFields)}`,
      json: true
    }, (error, response, body) => {
      if (body.result == true) {
        // return true;
        console.log(true);
      }
      if (body.result != true) {
        // return false;
        console.log(false);
      }
    });
    res.end();
  }); */
});

app.get('/failure', (req, res) => {
  const reqDealId = req.query.invId;
  console.log(reqDealId);
  request.post({
    url: `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=497394343&text=сосиска`,
    json: true
  }, (error, response, body) => {
      if (error) console.log(error);
      else console.log('Тесты прошли успешно')
  });
  res.end();
  /* const text = 'Отказано. Проверьте состояние оплаты или обратитесь в команду поддержки для помощи.';
  const updateDealFields = {
    "ID": reqDealId,
    "fields": {
      "OPENED": "N",
      "CLOSED": "Y",
      "STAGE_ID": "LOSE"
    }
  };
  getDealById(reqDealId).then(response => {
    const chatID = response.result.COMMENTS.split(" ")[0];
    const companyName = response.result.COMMENTS.split(" ")[1];
    console.log(chatID, companyName);
    const data = {
      "chat_id": chatID,
      "text": text
    };
    request.post({
      url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      body: data,
      json: true
    }, (error, response, body) => {
        if (error) console.log(error);
        else console.log('Не прошла оплата. С кем не бывает')
    });
    request({
      url: `${bitrix24Url}/crm.deal.update?${httpBuildQuery(updateDealFields)}`,
      json: true
    }, (error, response, body) => {
      if (body.result == true) {
        return true;
      }
      if (body.result != true) {
        return false;
      }
    });
  }); */
});

app.listen(PORT, () => {
  console.log('Server has been started...')
});