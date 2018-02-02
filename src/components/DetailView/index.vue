<template>
  <div class="picker-detail expanded">
    <DetailCard class="picker-detail-card"
      v-if="detail"
      :info="detail"
      :bookmarked="isBookmarked"
      @bookmark="$emit('bookmark', clinicId)"
      @close="close" />
    <div class="picker-loading" v-else>
      <spinner :size="60" color="grey" />
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {toSVY21} from 'sg-heatmap/dist/helpers/geometry'

import DetailCard from './DetailCard'

export default {
  name: 'DetailView',
  props: {
    clinicId: String,
    selectedTab: String
  },
  computed: {
    ...mapState(['entityDetail', 'bookmarked', 'location']),
    detail () {
      if (this.clinicId in this.entityDetail) {
        let clinic = this.entityDetail[this.clinicId]

        if (this.location) {
          const location = toSVY21(this.location)

          const distance = Math.sqrt(
            Math.pow(location[0] - clinic.svy21[0], 2) +
            Math.pow(location[1] - clinic.svy21[1], 2)
          )
          clinic = Object.assign({distance}, clinic)
        }

        if (this.travelTime) {
          clinic = Object.assign({travelTime: this.travelTime[clinic.id]}, clinic)
        }

        return clinic
      } else {
        this.fetchEntityDetail(this.clinicId)
      }
    },
    isBookmarked () {
      return this.bookmarked.indexOf(this.clinicId) > -1
    }
  },
  methods: {
    ...mapActions(['fetchEntityDetail']),
    close () {
      this.$router.push({path: this.selectedTab, query: this.$route.query})
    }
  },
  components: {DetailCard}
}
</script>

<style lang="scss">
.picker-detail {
  overflow-y: auto;
  background: white;
  position: relative;
}

.picker-loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  svg {
    position: relative;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -30px;
  }
}
</style>
