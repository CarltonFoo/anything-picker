<template>
  <div class="item multiple-lines operating-hours-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">OPERATING HOURS</small></strong>
      <q-select class="block"
        :class="value ? 'text-primary' : 'text-grey'"
        ref="select"
        type="list"
        :value="value"
        :options="options"
        @input="onInput" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      options: state => state.operatingHours.options,
      value: state => state.operatingHours.selected
    })
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'operatingHours', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    }
  }
}
</script>

<style lang="scss">
.operating-hours-tab {
  .q-picker-textfield::after {
    content: url('/assets/Dropdown.svg')!important;
  }
}
</style>
