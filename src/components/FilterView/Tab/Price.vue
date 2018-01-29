<template>
  <div class="item multiple-lines price-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">PRICE</small></strong>
      <small class="reset text-primary absolute-right cursor-pointer" @click="reset">reset</small>
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
import {mapActions} from 'vuex'

export default {
  computed: {
    ...mapState({
      options: state => state.price.options,
      value: state => state.price.selected
    })
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'price', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    },
    ...mapActions(['resetOptions', 'exportOptions']),
    expand () {
      this.$emit('expand', 'price')
    },
    reset () {
      this.resetOptions({module: 'price'})
      this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
    }
  }
}
</script>

<style lang="scss">
.price-tab {
  .q-picker-textfield::after {
    content: url('/assets/Dropdown.svg')!important;
  }
  .reset {
    height: 25px;
    margin-top: 12px;
    margin-right: 12px;
    padding: 4px;
    text-decoration: underline;

    .mobile & {
      padding-top: 5px;
    }
  }
}
</style>
