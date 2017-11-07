import axios from 'axios'
import fs from 'fs'
import cheerio from 'cheerio'

const endpoints = {
  locations: 76
}

Object.keys(endpoints).map(ep => {
  return axios({
    method: 'get',
    url: `https://www.singhealth.com.sg/PatientCare/GP/Pages/Home.aspx`,
    responseType: 'text'
  }).then(res => cheerio.load(res.data))
    .then(getClinicRegion)
    .catch(function (error) {
      console.log(error)
    })

  function getClinicRegion ($) {
    const result = {}
    result.location = $('.contentpage > table').find('a').map(function () {
      return $(this).attr('href').replace('/PatientCare/GP/Pages/', '').replace('.aspx', '').replace('https://www.singhealth.com.sg', '')
    }).get()
    fs.writeFile('data/clinicLocation.json', JSON.stringify(result, null, '\t'))
  }
})
