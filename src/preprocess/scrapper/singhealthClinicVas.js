import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
import {ThrottledQueue} from '../../helpers/util'

import {location as clinicLocation} from '../../../data/clinicLocation.json'

const queue = new ThrottledQueue(100)
const debug = []
const arrVal = clinicLocation.length
// const clinicSubset = clinicLocation.slice(19, 20)
const clinicSubset = clinicLocation.slice(0, arrVal)
// const clinicSubset = clinicLocation.slice(0, 1)
const jobs = clinicSubset.map((id, i) => queue.push(fetchClinicInfo, id, clinicSubset.length - i))

Promise.all(jobs).then(() => {
  if (debug.length > 0) console.log('Unsuccessfull:', debug)
})

function fetchClinicInfo (id, k) {
  if (k % 100 === 0) console.log(k)
  return axios({
    method: 'get',
    url: 'https://www.singhealth.com.sg/PatientCare/GP/Pages/' + id + '.aspx',
    responseType: 'text'
  }).then(res => cheerio.load(res.data))
    .then(parseClinicInfo)
    .then(result => {
      fs.writeFile(`data/singhealthraw/${id}.json`, JSON.stringify(result, null, '\t'))
    })
    .catch(err => {
      debug.push(id)
      console.error(err.message)
    })
}

function parseClinicInfo ($) {
  const result = {}
  let enterRow = $('.contentpage > table').first().find('tr')
  let enterName = enterRow.eq(1).find('td > strong')
  // let countTd = enterRow.find('td > strong').length
  // forEach()
  result.regionName = enterRow.eq(0).find('td').text().trim()
  result.name = enterName.eq(0).text().trim()
  let elements = enterRow.eq(1).find('td').text().trim().split('\n')
  let filteredElements = elements.filter(val => val.replace(/\s/g, '').length).map(val => val.trim())
  result.address = filteredElements[1] + filteredElements[2]
  result.postalCode = filteredElements[3]
  result.tel = filteredElements[4].slice(8, 16)

  let enterTable = $('.contentpage > table').first().find('table').first().find('tr')
  let operatingTable = enterTable.eq(0).find('td').text().trim()
  console.log(operatingTable)

  return result
}
