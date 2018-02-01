import fs from 'fs'

const files = fs.readdirSync('public/data/entities').filter(file => file.match(/\.json$/))
const aia = require('../../data/insurance/AIA.json')
const axacc = require('../../data/insurance/AXA Clinicare.json')
const axams = require('../../data/insurance/AXA Medismart.json')
const chas = require('../../data/insurance/CHAS.json')
const greateastern = require('../../data/insurance/Great Eastern.json')
const rawaia = aia.insurance
const totalAia = Object.keys(rawaia).length
const totalAxacc = Object.keys(axacc).length
const totalAxams = Object.keys(axams).length
const totalChas = Object.keys(chas).length
const totalGreateastern = Object.keys(greateastern).length

files.forEach(file => {
  try {
    const raw = require('../../public/data/entities/' + file)
    const processed = Object.assign({}, raw)
    processed.id = raw.id

    const rawArr = []
    processed.insurance = rawArr

    for (var i = 0; i < totalAia; i++) {
      if (processed.insurance && raw.id === rawaia[i].hci) {
        if (!(rawArr.indexOf('AIA') > -1)) {
          processed.insurance.push('AIA')
        }
      }
    }

    for (var o = 0; o < totalAxacc; o++) {
      if (processed.insurance && Number(raw.tel) === axacc[o].TEL) {
        if (!(rawArr.indexOf('AXA Clinicare') > -1)) {
          processed.insurance.push('AXA Clinicare')
        }
      }
    }

    for (var p = 0; p < totalAxams; p++) {
      if (processed.insurance && raw.fax === axams[p].FAX) {
        if (!(rawArr.indexOf('AXA Medismart') > -1)) {
          processed.insurance.push('AXA Medismart')
        }
      }
    }

    for (var a = 0; a < totalChas; a++) {
      if (processed.insurance && raw.tel === (chas[a].PHONE).replace(/\s/g, '')) {
        if (!(rawArr.indexOf('CHAS') > -1)) {
          processed.insurance.push('CHAS')
        }
      }
    }

    for (var s = 0; s < totalGreateastern; s++) {
      if (processed.insurance && Number(raw.fax) === greateastern[s].FAX) {
        if (!(rawArr.indexOf('Great Eastern') > -1)) {
          processed.insurance.push('Great Eastern')
        }
      }
    }
    console.log(processed.insurance)
    fs.writeFileSync(`public/data/newentities/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
  } catch (err) {
    console.log('Bad record', file)
    throw err
  }
})
