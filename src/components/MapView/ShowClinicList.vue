<template>
  <div class="show-clinic-list" @click="toggleList">
    <div class="desktop-only">
      <div class="postal-code-input text-white">
        <div class="search-button cursor-pointer">
          <img src='/assets/Locate_Me.svg'></img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    toggleList () {
      this.$emit('toggleList')
    }
  }
}

</script>

<style lang="scss">
@import "~style/variables.scss";

.show-clinic-list {
  z-index: 10;
  margin-bottom: 15px;
  margin-right: 20px;

  .desktop-only {
    width: 280px;
  }

  span {
    font-size: 0.9rem;
    font-weight: 700;
    font-spacing: 0.75px;
    text-shadow:
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px 1px 0 white,
      1px 1px 0 white;


    &.skip {
      float: right;
    }
  }

  .postal-code-input {
    background-color: $color-primary;
    border-radius: 5px;
    margin-top: 7px;
    width: 100%;

    input {
      border: 0;
      color: white;
      padding: 5px 15px;
      height: 40px;
      width: 220px;

      &::placeholder {
        color: white;
        font-style: italic;
      }
    }

    .search-button {
      width: 40px;
      height: 42px;
      background-color: $color-faded;
      border: 2px solid $color-primary;
      float: right;
      border-radius: 0 5px 5px 0;
      padding: 9px;
    }
  }

  .q-fab {
    width: inherit;

    button {
      border-radius: 5px;
      background-color: $color-primary;
      height: 42px;
      width: 40px;
      margin: 0;
      box-shadow: none;

      i {
        top: 10px;
        left: 10px;
        width: 20px;
        height: 20px;

        &.q-fab-icon {
          content: url("/assets/Locate Me_White.svg");
        }
      }
    }

    .backdrop {
      display: none;
    }

    .q-popover {
      top: 0;
      left: -20px;
      position: absolute;

      .postal-code-input-mobile {
        background-color: $color-primary;
        border-radius: 5px;
        width: 210px;

        input {
          border: 0;
          color: white;
          padding: 5px 15px;
          height: 40px;
          width: 170px;

          &::placeholder {
            color: white;
            font-style: italic;
          }
        }

        .search-button {
          width: 40px;
          height: 42px;
          background-color: $color-faded;
          border: 2px solid $color-primary;
          float: right;
          border-radius: 0 5px 5px 0;
          padding: 9px;
        }
      }
    }
  }
}
</style>
