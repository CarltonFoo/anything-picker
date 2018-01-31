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
      if (processed.insurance) {
        if (raw.id === rawaia[i].hci) {
          processed.insurance.push('AIA')
        }
      }
    }

    for (var o = 0; o < totalAxacc; o++) {
      if (processed.insurance) {
        if (Number(raw.tel) === axacc[o].TEL) {
          processed.insurance.push('AXA Clinicare')
        }
      }
    }

    for (var p = 0; p < totalAxams; p++) {
      if (processed.insurance) {
        if (raw.fax === axams[p].FAX) {
          processed.insurance.push('AXA Medismart')
        }
      }
    }

    for (var a = 0; a < totalChas; a++) {
      if (processed.insurance) {
        if (raw.tel === (chas[a].PHONE).replace(/\s/g, '')) {
          processed.insurance.push('CHAS')
        }
      }
    }

    for (var s = 0; s < totalGreateastern; s++) {
      if (processed.insurance) {
        if (Number(raw.fax) === greateastern[s].FAX) {
          processed.insurance.push('Great Eastern')
        }
      }
    }

    fs.writeFileSync(`public/data/newentities/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
  } catch (err) {
    console.log('Bad record', file)
    throw err
  }
})
