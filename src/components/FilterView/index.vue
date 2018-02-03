<template>
  <div class="picker-filter toolbar tertiary no-padding">
    <div class="row auto">
      <LocationTab class="width-1of4" @expand="openModal" />
      <OperatingHrsTab class="width-1of4" @expand="openModal"/>
      <!-- <PriceTab class="width-1of5" /> -->
  	  <InsuranceTab class="width-1of4" @expand="openModal" />
      <TypeTab class="width-1of4" @expand="openModal" />
  	</div>

    <LocationModal ref="location" />
    <OperatingHrsModal ref="operatingHrs" />
    <InsuranceModal ref="insurance" />
    <TypeModal ref="type" />
  </div>
</template>

<script>
import LocationTab from './Tab/Location'
import OperatingHrsTab from './Tab/OperatingHrs'
import InsuranceTab from './Tab/Insurance'
import TypeTab from './Tab/Type'
// import PriceTab from './Tab/Price'

import LocationModal from './Modal/Location'
import OperatingHrsModal from './Modal/OperatingHrs'
import InsuranceModal from './Modal/Insurance'
import TypeModal from './Modal/Type'

export default {
  name: 'FilterView',
  // computed: {
  //   DynamicTab () {
  //     const schoolLevel = this.$store.state.schoolLevel.selected
  //     if (schoolLevel === 'S' || schoolLevel === 'T') return 'PsleTab'
  //     if (schoolLevel === 'J') return 'L1R5Tab'
  //     return 'LocationTab'
  //   }
  // },
  methods: {
    openModal (id) {
      this.$refs[id].$children[0].open()
    }
  },
  components: {
    LocationTab,
    LocationModal,
    OperatingHrsTab,
    OperatingHrsModal,
    InsuranceTab,
    InsuranceModal,
    TypeTab,
    TypeModal,
    // PriceTab
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.picker-filter {
  overflow-x: hidden;
  height: 100px;

  .item-title {
    display: block;
    padding-bottom: 10px;
    letter-spacing: 0.75px;
  }

  .width-1of4 {
    min-width: 210px;
    border-left: 2px solid $color-border;
    height: 100px;

    &:first-child {
      border-left: none;
    }

    .q-picker-textfield {
      border-radius: 5px;
      background: $color-faded;
      height: 40px;
      padding: 10px 40px 0 15px!important;
      border-bottom: 0;
      border: 2px solid $color-faded;
      font-style: italic;

      &.active {
        background: $color-tertiary;
        font-style: normal;
      }

      &:hover, &:focus {
        border: 2px solid $color-faded;
      }

      &::after {
        height: 100%;
        width: 40px;
        top: 0;
        text-align: center;
        transform: none!important;
        padding: 9px 15px 0;
        background: $color-faded;
        content: url('/assets/Options.svg');
      }
    }
  }

  & > .item:first-child {
    flex: 0 0 450px;
  }
}




</style>
