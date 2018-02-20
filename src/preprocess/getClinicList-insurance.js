import axios from 'axios'
import fs from 'fs'
import querystring from 'querystring'
import _range from 'lodash/range'

import {ThrottledQueue} from '../helpers/util'

const batchSize = 10

const endpoints = {
  // clinic: 4128,
  // hospital: 35,
  // nursing: 77,
  Insurance: 1000
}

const queue = new ThrottledQueue(100)

const tasks = Object.keys(endpoints).map(ep => {
  function fetchPage (pageNo) {
    return axios({
      method: 'get',
      url: `https://qualityhealthcare.aia.com.sg/aia-quality-healthcare/services/specialist/search`,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        applyFilter: false,
        gender: "",
        hospitals: "",
        key: 41344953,
        keyword: "",
        newSearch: false,
        page: pageNo,
        specialisations: "",
        type: "all"
      }
      // responseType: 'text'
    }).then(res => {
      var specialists = res.data.data.specialists
      return Promise.all(specialists.map(spec => {
        // console.log(spec.mcrnumber)
        return axios({
          method: 'get',
          url: 'https://qualityhealthcare.aia.com.sg/aia-quality-healthcare/services/clinic/listing',
          params: {
            mcr: spec.mcrnumber,
            key: 41344953
          }
        }).then(res => {
          return res.data.data.clinics.reduce((a, v) => a.concat(v), [])
        })
      })).then(res => res.reduce((a, v) => a.concat(v), []))
    })
  }

  function batchFetch (batchNo) {
    return Promise.all(_range(batchSize).map(i => fetchPage(batchNo * batchSize + i + 1)))
       .then(results => results.reduce((a, v) => a.concat(v), []))
  }

  const batchCount = Math.ceil(endpoints[ep] / batchSize / 10)
  return Promise.all(_range(batchCount).map(i => queue.push(batchFetch, i)))
     .then(results => results.reduce((a, v) => a.concat(v), []))

  //return fetchPage(1) //first page
})

Promise.all(tasks)
  .then(results => {
    console.log('results!')
    console.log(results)
    const merged = {}
    Object.keys(endpoints).forEach((ep, i) => {
      merged[ep] = results[i]
    })
    fs.writeFileSync('data/AIA.json', JSON.stringify(merged))
  })
  .catch(console.error)
