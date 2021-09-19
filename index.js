const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const {snipe} = require('./services/hypixelAuctions');

let data = [];

(async function fetchData() {

  console.log('Fetching data...')
  try {
    const res = await snipe()
    if(!(res instanceof Object)) {
        setTimeout(fetchData, 10000)
        return
    }
    data = Object.values(res)
  
    console.log(data)
  } catch (error) {
    setTimeout(fetchData, 30000)
  }

})()

express()
  .use(express.static(path.join(__dirname, './build/')))
  .get('/data', async(req, res) => {
    res.json(data)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


