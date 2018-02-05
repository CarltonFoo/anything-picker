import {collectValues} from 'helpers/util'

const singleInputs = [
]

const multiInputs = [
]

export function getFiltered (state, getters) {
  return state.entityList
    .map(clinic => {
      let match = true
      if (state.planningAreas.selected.length > 0) {
        const selected = state.planningAreas.selected
        match = match && selected.indexOf(clinic.planningArea) > -1
      }
      if (state.operatingHrs.selected) {
        const selected = state.operatingHrs.selected
        var selectedDays = []
        for (var i = 0; i < selected.length; i++) {
          if (selected[i].charAt(0) == 'M' || selected[i].charAt(0) == 'T' || selected[i].charAt(0) == 'W' || selected[i].charAt(0) == 'F' || selected[i].charAt(0) == 'S') {
            selectedDays[i] = selected[i]
          }
          else if (selected[i].charAt(0) == '1' || selected[i].charAt(0) == '2' || selected[i].charAt(0) == '0') {
            var selectedTime = selected[i]
          }
        } // seperate days and hours in selected array
        for (i=0; i<selectedDays.length; i++) {
          var day = selectedDays[i];
          if (clinic.operatingHrs[day] && clinic.operatingHrs[day].length >= 1) {
            var ifopen
            clinic.operatingHrs[day].forEach(function(str) {
              var str = str.toString();
              var arr = str.split(",");
              var open = arr.splice(0,1).join("");
              var close = arr.splice(0,1).join("");

              var searcharr = String(selectedTime).split(":");
              var h = searcharr.splice(0,1).join("");
              var m = searcharr.splice(0,1).join("");

              var openarr = open.split(":");
              var a = openarr.splice(0,1).join("");
              var b = openarr.splice(0,1).join("");

              var closearr = close.split(":");
              var c = closearr.splice(0,1).join("");
              var d = closearr.splice(0,1).join("");

              if (a > c || ((a == c) && (b > d))) {
                // not a valid input
              } else {
                  if (h > a && h < c) {
                    ifopen = true;
                  } else if (h == a && m >= b) {
                    ifopen = true;
                  } else if (h == c && m <= d) {
                    ifopen = true;
                  } else {
                    ifopen = false;
                  }
                }
              });
            if (ifopen == true) {
              match = true
              console.log(clinic.name + " is open.");
            } else {
              match = false
              console.log(clinic.name + " is closed.");
            }
          } else {
            match = false
            console.log(clinic.name + " has no opening hours avaliable on " + selectedDays[i])
          }
        }

      }

      // if (state.psle.selected) {
      //   const selected = +state.psle.selected
      //   const selectedRange = {lower: selected, upper: selected + 9}
      //   match = match && school.psleAggregate.some(range => {
      //     return range.lower <= selectedRange.upper &&
      //       Math.min(range.lower + 45, range.upper) >= selectedRange.lower
      //   })
      // }

      if (state.combinedSpecialties.selected.length > 0) {
        const selected = state.combinedSpecialties.selected
        match = match && clinic.combinedSpecialties.some(type => selected.includes(type))
      }
      if (state.insurance.selected.length > 0) {
        const selected = state.insurance.selected
        match = match && clinic.insurance.some(scheme => selected.includes(scheme))
      }

      // if (state.price.selected) {
      //   const selected = state.price.selected
      //   match = match && clinic.price.indexOf(selected) > -1
      // }
      // if (state.schoolLevel.selected) {
      //   const selected = state.schoolLevel.selected
      //   match = match && school.levelOfEducation.indexOf(selected) > -1
      // }
      // if (state.ccasOffered.selected.length > 0) {
      //   const selected = state.ccasOffered.selected
      //   match = match && selected.some(cca => cca in school.ccas)
      // }
      // if (state.distinctiveProgrammes.selected.length > 0) {
      //   const selected = state.distinctiveProgrammes.selected
      //   match = match && selected.some(program => {
      //     return Object.keys(school.specialProgrammes)
      //       .some(key => key.indexOf(program) > -1)
      //   })
      // }
      // if (state.specialNeeds.selected.length > 0) {
      //   const selected = state.specialNeeds.selected
      //   match = match && selected.some(need => {
      //     if (need === 'HL') return 'HL.Signing' in school.specialNeeds || 'HL.Oral' in school.specialNeeds
      //     return need in school.specialNeeds
      //   })
      // }
      // if (state.schoolTypes.selected.length > 0) {
      //   const selected = state.schoolTypes.selected
      //   match = match && selected.some(type => {
      //     if (type === 'G') return 'Government School' in school.schoolType || 'Government-aided Sch' in school.schoolType
      //     else if (type === 'I') return 'Independent School' in school.schoolType || 'Specialised Independent School' in school.schoolType
      //     else if (type === 'S') return 'Specialised School' in school.schoolType || 'Specialised Independent School' in school.schoolType
      //     else if (type === 'BOYS') return "Boys' School" in school.schoolType
      //     else if (type === 'GIRLS') return "Girls' School" in school.schoolType
      //     else if (type === 'COED') return 'Co-ed School' in school.schoolType
      //   })
      // }
      // if (state.psle.selected) {
      //   const selected = +state.psle.selected
      //   const selectedRange = {lower: selected, upper: selected + 9}
      //   match = match && school.psleAggregate.some(range => {
      //     return range.lower <= selectedRange.upper &&
      //       Math.min(range.lower + 45, range.upper) >= selectedRange.lower
      //   })
      // }
      // if (state.l1r5.selected) {
      //   const selected = +state.l1r5.selected
      //   match = match && school.l1r5Aggregate.some(range => range.upper >= selected)
      // }
      return match
    })
}

export function getSuggested (state, getters) {
  return state.entityList.map(clinic => false)
}

export function importOptions (context, query) {
  if (query.shortlist) {
    const bookmarked = context.state.entityList.map(school => school.id)
      .filter(id => query.shortlist.split(',').indexOf(id) > -1)
    context.commit('setBookmarked', bookmarked)
  } else {
    context.commit('setBookmarked', [])
  }

  singleInputs.forEach(module => {
    if (query[module]) {
      const match = query[module].toUpperCase()
      const updated = collectValues(context.state[module].options)
        .indexOf(match) > -1 ? match : ''
      context.commit('updateSelected', {module, updated})
    } else {
      context.commit('updateSelected', {module, updated: null})
    }
  })

  multiInputs.forEach(module => {
    if (query[module]) {
      const matches = query[module].split(',')
        .map(str => str.trim().toUpperCase())
      const updated = collectValues(context.state[module].options)
        .filter(option => matches.indexOf(option) > -1)
      context.commit('updateSelected', {module, updated})
    } else {
      context.commit('updateSelected', {module, updated: []})
    }
  })

  if (query.postalCode && query.postalCode.match(/^\d{6}$/)) {
    context.dispatch('locateAddress', query.postalCode)
  } else {
    context.commit('setPostalCode', null)
    context.commit('setLocation', null)
  }
}

export function exportOptions (context) {
  const query = {}

  singleInputs.forEach(module => {
    if (context.state[module].selected) {
      query[module] = context.state[module].selected
    }
  })

  multiInputs.forEach(module => {
    if (context.state[module].selected.length > 0) {
      query[module] = context.state[module].selected.join(',')
    }
  })

  if (context.state.bookmarked.length > 0) {
    query.shortlist = context.state.bookmarked.join(',')
  }
  if (context.state.postalCode) {
    query.postalCode = context.state.postalCode
  }
  return query
}
