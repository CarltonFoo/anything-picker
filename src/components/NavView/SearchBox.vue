<template>
  <div class="picker-searchbox item multiple-lines bg-secondary">
    <div class="item-content">
      <!-- <strong><small class="item-title text-black">SEARCH</small></strong> -->
      <q-autocomplete
        v-model="searchVal"
        @search="search"
        @selected="selected"
        :min-characters="2"
        :delay="0"
        delimiter>
        <q-search @click.native="toggleDrawer" v-model="searchVal" placeholder="Search for a clinic" />
      </q-autocomplete>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      searchVal: ''
    }
  },
  computed: {
    ...mapState({
      entityList: state => state.entityList,
      // clinicLevel: state => state.clinicLevel.selected
    })
  },
  methods: {
    search (value, done) {
      const filtered = this.entityList.filter(clinic => {
      //   return !this.schoolLevel || school.levelOfEducation.indexOf(this.schoolLevel) > -1
      // }).filter(school => {
        const terms = clinic.name.split(' ').map((v, i, arr) => {
          return arr.slice(i).join(' ')
        })
        const pattern = new RegExp('^' + value, 'i')

        return terms.some(term => {
          if (term.match(/^(CLINIC|HOSPITAL)$/)) return false
          return terms.some(term => term.match(pattern))
        })
      })
      .map(clinic => ({
        label: clinic.name,
        value: clinic.name,
        icon: 'clinic',
        id: clinic.id
      }))
      done(filtered)
    },
    selected (item) {
      this.$router.push({
        path: '/detail/' + item.id,
        query: this.$route.query
      })
      this.searchVal = ''
    },
    toggleDrawer () {
      this.$emit('toggleDrawer')
    }
  }
}
</script>

<style lang="scss">
$color-secondary-darker: #0e5f7f;
$color-searchbox: #005b7f;
$toolbar-bg: #008fd6;
// $text-color: #273246;

.picker-searchbox {
  // background-color: $color-secondary-darker!important;
  display: inline-block;
  background-color: $toolbar-bg !important;

  .item-content {
    border: 1px solid $toolbar-bg;
    padding-left: 22px;
    padding-right: 22px;
    margin-left: 0;
    margin-right: 0;
  }

  .q-search {
    .q-search-input-container {
      position: relative;
      color: white;

      .q-search-input {
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        box-shadow: none;
        border-radius: 5px;
        background-color: $color-searchbox;
        font-size: 0.9rem;
      }

      input::placeholder{
        font-style: italic;
        color: white;
      }
    }
  }
}

.q-popover .item-primary ~ .item-content {
    margin-left: 1em;
    font-size: 1em;
}
</style>
