<template>
  <div class="card column no-shadow">
    <div class="card-title text-primary">
      <span>{{info.name}}</span>
    </div>
    <div class="card-content">
      <div>
        <div>{{clinicSummary.combinedSpecialties}}</div>
        <dl>

          <template v-if="clinicSummary.address">
            <dt>Location:</dt>
            <dd>{{clinicSummary.address}}</dd>
          </template>

          <template v-if="clinicSummary.rawOperatingHours">
            <dt>Operating Hours:</dt>
            <dd>{{clinicSummary.rawOperatingHours}}</dd>
          </template>

          <template v-if="clinicSummary.insurance">
            <dt>Insurance Coverage:</dt>
            <dd>{{clinicSummary.insurance}}</dd>
          </template>

        </dl>
      </div>

      <span class="action-bookmark cursor-pointer text-primary"
        :class="{'text-bookmark': bookmarked}"
        @click="$emit('bookmark', info.id)">
        <img :src="bookmarked ? '/assets/Star_Green.svg' : '/assets/Star_Blue.svg'" />
        Bookmark
      </span>

    </div>

    <div class="list item-delimiter auto column text-primary">

      <!-- <q-collapsible ref="generalInfo" label="GENERAL INFO">
        <dl>
          <template v-for="row in generalInfo" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible> -->

      <q-collapsible ref="contactInfo" label="CONTACT" class="text-primary">
        <dl>
          <template v-for="row in contactInfo" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="license" label="LICENSE" class="text-primary">
        <dl>
          <template v-for="row in license" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="doctorInCharge" label="DOCTOR IN CHARGE" class="text-primary">
        <dl>
          <template v-for="row in doctorInCharge" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible v-if="this.info.mohApprovedSpecialServices" ref="MOHServices" label="MOH APPROVED SERVICES" class="text-primary">
        <dl>
          <template v-for="row in MOHServices" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="detailedServices" label="SERVICES" class="text-primary">
        <dl>
          <template v-for="row in detailedServices" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="programmes" label="PROGRAMMES" class="text-primary">
        <dl>
          <template v-for="row in programmes" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.value instanceof Array">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

    </div>
    <div class="exit absolute-top-right cursor-pointer" @click="$emit('close')">
      <i class="text-grey">
        clear
      </i>
    </div>
  </div>
</template>

<script>
import omit from 'lodash/omit'
import max from 'lodash/max'
import maxBy from 'lodash/maxBy'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'

export default {
  props: {
    info: Object,
    bookmarked: Boolean
  },
  data () {
    return {
      // medalIcon: {
      //   Distinction: '/assets/Gold.svg',
      //   Accomplishment: '/assets/Silver.svg',
      //   Recognition: '/assets/Bronze.svg',
      //   Gold: '/assets/Gold.svg',
      //   Silver: '/assets/Silver.svg',
      //   Bronze: '/assets/Bronze.svg',
      //   '1st': '/assets/Gold.svg',
      //   '2nd': '/assets/Silver.svg',
      //   '3rd': '/assets/Bronze.svg'
      // }
    }
  },
  computed: {
    clinicSummary () {
      const combinedSpecialties = String(this.info.combinedSpecialties).replace(",", ", ")
      const address = this.info.address
      var rawOperatingHours
      if (this.info.rawOperatingHours) {
        rawOperatingHours = JSON.stringify(this.info.rawOperatingHours, null, " ").replace("{}", "No operating hours avaliable.").replace(/"|"|{|}/g, '').replace(":", ": ").trim()
      } else {
        rawOperatingHours = "No operating hours avaliable."
      }
      const insurance = String(this.info.insurance)
      return {
        combinedSpecialties,
        address,
        rawOperatingHours,
        insurance,
      }
    },
    contactInfo () {
      return this.info && [
        {label: 'Address', value: this.info.address},
        {label: 'Telephone / Fax', value: (this.info.tel || 'Not available') + ' / ' + (String(this.info.fax).replace("00000000", "Not available") || 'Not available')}
      ]
    },
    license () {
      return this.info && [
        {label: 'Licensee', value: this.info.licensee},
        {label: 'License Period', value: this.info.licensePeriod},
        {label: 'License Class', value: String(this.info.licenseClass).replace(/((\[)|(\]))/g, "")}
      ]
    },
    doctorInCharge () {
      if (this.info) {
        const info = this.info.doctorInCharge
        return [
          {label: 'Name', value: String(info[0].name)},
          {label: 'Qualification', value: info[0].qualifications},
          {label: 'Specialties', value: String(info[0].specialties)}
        ]
      }
    },
    MOHServices () {
      return this.info && [
        {label: 'MOH Approved Services', value: this.info.mohApprovedSpecialServices}
      ]
    },
    detailedServices () {
      return this.info && [
        {label: 'Services', value: JSON.stringify(this.info.detailedServices).replace(/"|"|{|}/g, '').replace(":true", "").trim()}
      ]
    },
    programmes () {
      return this.info && [
        {label: 'Programmes', value: this.info.programmes}
      ]
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.picker-detail-card {
  margin-bottom: 0;
  font-size: 0.8em;

  .card-title {
    padding: 30px 28px 10px 36px;
    display: flex;
    align-items: center;
    margin-bottom: 5px!important;

    a {
      margin-left: 1em;
      font-size: 60%;
    }
  }

  .card-content {
    padding: 0 28px 30px 36px;

    dl {
      margin: 2em 0;
    }

    & > span {
      margin-right: 1em;

      img {
        height: 10px;
        margin-right: 5px;
      }
    }

    .fully-booked > td:last-child::after {
      content: "full";
      margin-left: 0.5em;
      color: red;
      font-size: 0.8em;
      font-weight: 500;
    }
  }

  .q-collapsible {
    overflow-y: auto;
    min-height: 69px;
    padding: 10px 20px;

    .item.item-link {
      height: auto;
      margin: -10px -20px;
      padding: 10px 20px;

      &:hover {
        background: rgba(0, 0, 0, 0.1)
      }

      .item-content {
        font-weight: 700;
        letter-spacing: 0.75px;
        margin-right: 0;
      }

    .item-secondary {
        display: none;
      }
    }

    .q-collapsible-sub-item {
      margin-top: 10px;
    }

    dl:last-child {
      margin-bottom: 0;
    }

    .achivement-container {
      padding-bottom: 20px;

      .legend {
        width: 100%;
        padding: 2px 5px;
        margin-top: 5px;
        border: 0.5px solid rgba(128, 128, 128, 0.25);

        div {
          padding: 3px 0px;
          display: inline-block;
          font-size: 0.8em;
          white-space: nowrap;
          vertical-align: middle;

          img {
            width: 10px;
            height: 10px;
            margin: 0 10px;
          }
        }
      }

      table {
        width: 100%;
        padding-top: 5px;
        border-collapse: collapse;

        tr {
          td {
            border: none;
            width: 45px;
            position: relative;


            &.year-label {
              text-align: center;
            }

            &.cca-label {
              width: 150px;
              padding: 5px 0 5px 10px;
            }

            img {
              margin-left: 20px;
              width: 12px;
              height: 12px;
            }
          }

          &:nth-child(2n) td{
            background: #f2f2f2;
          }
        }
      }
    }
  }

  dd ~ dt {
    margin-top: 1.5em;
  }

  dt {
    color: $color-secondary;
  }

  .cop-details,
  .l1r5-details,
  .p1-registration {
    width: 100%;

    td {
      width: 50%;
    }
  }

  .row.wrap {
    justify-content: space-between;
  }

  .width-1of2 {
    min-width: 0;
    flex-basis: 45%;
  }

  .exit {
    margin-top: 5px;
    margin-right: 5px;
    padding: 10px;
    font-size: 1.5em;
  }

  .item-content.has-secondary::after {
    content: '';
    float: right;
    position: absolute;
    display: inline-block;
    top: 18px;
    right: 15px;
    border-right: 2px solid grey;
    border-bottom: 2px solid grey;
    height: 8px;
    width: 8px;
    transform: rotate(45deg);
  }
}

.q-tooltip {
  padding: 7px;
  background-color: $color-primary;
  font-size: 10px;
  font-weight: 700;
  white-space: pre;
}
</style>
