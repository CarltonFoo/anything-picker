<template>
  <div class="picker-filter toolbar tertiary no-padding">
    <!-- <SearchBox /> -->
    <div class="row auto">
      <LocationTab class="width-1of5" @expand="openModal" />
      <OperatingHoursTab class="width-1of5" />
      <PriceTab class="width-1of5" />
  	  <InsuranceTab class="width-1of5" @expand="openModal" />
      <TypeTab class="width-1of5" @expand="openModal" />
  	  <!-- <MoreOptionsTab class="width-1of5" @expand="openModal" /> -->
    </div>

    <LocationModal ref="location" />
    <InsuranceModal ref="insurance" />
    <TypeModal ref="type" />
    <!-- <MoreOptionsModal ref="more" /> -->
  </div>
</template>

<script>
import LocationTab from './LocationTab'
import LocationModal from './LocationModal'
import OperatingHoursTab from './OperatingHoursTab'
import PriceTab from './PriceTab'
import InsuranceTab from './InsuranceTab'
import InsuranceModal from './InsuranceModal'
import TypeTab from './TypeTab'
import TypeModal from './TypeModal'
// import SchoolLevelTab from './SchoolLevelTab'
// import MoreOptionsTab from './MoreOptionsTab'
// import MoreOptionsModal from './MoreOptionsModal'
// import SearchBox from './SearchBox'

export default {
  name: 'FilterView',
  methods: {
    openModal (id) {
      this.$refs[id].$children[0].open()
    }
  },
  components: {
    LocationTab,
    LocationModal,
    OperatingHoursTab,
    PriceTab,
    InsuranceTab,
    InsuranceModal,
    TypeTab,
    TypeModal,
    // SchoolLevelTab,
    // MoreOptionsTab,
    // MoreOptionsModal,
    // SearchBox
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

  .width-1of5 {
    min-width: 168px;
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
