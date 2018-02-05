<template>
  <q-modal content-classes="filter-operatingHrs-modal" @close="onClose">
    <big class="exit text-grey absolute-top-right cursor-pointer" @click="$children[0].close()"><i>clear</i></big>
    <div>
      <big class="title text-primary text-bold">OPERATING HOURS</big>

      <div class="selection-row">
        <div class="select-group" v-for="group in operatingHrs">
          <p class="text-secondary text-bold">{{group.label}}</p>
          <div class="select-one column">
            <label class="ellipsis text-primary" v-for="operatingHrs in group.day">
              <q-checkbox :value="checked(operatingHrs)" @input="select(operatingHrs, $event)"/>
              {{operatingHrs.label}}
            </label>
          </div>
        </div>
        <div class="select-group">
          <vue-timepicker
          @change="changeHandler"
          format="HH:mm"
          :minute-interval="10"
          >
          </vue-timepicker>
        </div>
      </div>
      <div class="button-group">
        <button class="exit-done primary float-right" @click="$children[0].close()">DONE</button>
        <button class="exit-reset primary float-right" @click="resetAll()">RESET</button>
      </div>
    </div>
  </q-modal>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import VueTimepicker from 'vue2-timepicker'

export default {
  computed: {
    ...mapState({
      operatingHrs: state => state.operatingHrs.options
    }),
    ...mapGetters(['optionsSelected'])
  },
  methods: {
    ...mapActions([
      'selectOptions',
      'unselectOptions',
      'exportOptions',
      'resetOptions'
    ]),
    checked (options) {
      return this.optionsSelected({module: 'operatingHrs', options})
    },
    select (options, toCheck) {
      if (toCheck) this.selectOptions({module: 'operatingHrs', options})
      else this.unselectOptions({module: 'operatingHrs', options})
    },
    resetAll () {
      this.resetOptions({module: 'operatingHrs'})
    },
    onClose () {
      this.exportOptions().then(query => this.$router.push({query}))
    },
    changeHandler (eventData) {
      const selectedTime = eventData.data.HH + ": " + eventData.data.mm
      console.log(selectedTime)
      // return selectedTime
    }
  },
  components: {
    VueTimepicker
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.filter-operatingHrs-modal {
  padding: 70px;
  min-height: 70vh;
  min-width: 70vw;
  border-radius: 5px;
  overflow-y: hidden;

  @media (max-width: 920px) {
    min-width: 100vw;
  }

  big {
    letter-spacing: 0.75px;
  }

  big.exit {
    margin-top: 12px;
    margin-right: 20px;
  }


  .selection-row {
    height: 50vh;
     overflow-y: auto;
     margin: 25px 0;

     .mobile & {
      height: 75vh;

      @media (min-width: 600px) {
        height: 50vh;
      }
    }
  }

  .select-group {
    width: 50%;
    float: left;

    p {
      font-size: 1em;
      margin-bottom: 0.5em;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .select-one {
    column-width: 200px;

    label {
      display: block;
      margin-bottom: 10px;
      font-size: 0.9em;
      white-space: nowrap;
    }

    .q-checkbox {
      height: 18px;
    }

    .q-checkbox input + div:before {
      width: 15px;
      height: 15px;
      border-radius: 4px;
      margin: auto;
      border: 1px solid $color-primary;
    }

    .q-checkbox input:checked + div:after {
      top: 3px;
      left: 2px;
      width: 4px;
      height: 8px;
      border-right: 1.5px solid #fff;
      border-bottom: 1.5px solid #fff;
    }
  }

  button {
    margin-top: 20px;
    margin-left: 16px;
    border-radius: 5px;
    letter-spacing: 0.75px;

    &.exit-reset{
      background: $color-secondary;

      &:hover {
        background: $color-secondary!important;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 3.5vh 30px calc(3.5vh + 40px);

    .title {
      font-size: 20px;
    }

    .button-group {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;

      button {
        float: none;
        margin: 0;
        padding: 0;
        width: 50%;
        border-radius: 0;
        height: 40px;

      }
    }
  }
}
</style>
