<template>
  <div style="padding-bottom: 16px">

    <b-field :label="label">

    <b-dropdown v-model="value"> <!--v-bind:value="chosen" v-on:input="$emit('input', $event.target.chosen)-->
      <button class="button is-purp" type="button" slot="trigger" :style="{ width: width + 'px' }">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <template v-for="(item,index) in array">
            <div v-if="value == index" :key="index">
              <span>{{ item }}</span>
            </div>
          </template>
          <b-icon pack="fas" icon="chevron-down"></b-icon>
        </div>
      </button>

      <template v-for="(item,index) in array">
        <b-dropdown-item :value="index" :key="index">
          <div class="media">
            <div class="media-content">
              <h3>{{ item }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </template>
    </b-dropdown>

    </b-field>

  </div>
</template>

<script>

export default {
  name: 'buefy-drop',
  props: ['array', 'id', 'width', 'label', 'default'],
  data () {
    return {
      value: 0
    }
  },
  methods: {
    emitSelected () {
      this.$emit('select', {
        id: this.id,
        value: this.array[this.value]
      })
    }
  },
  watch: {
    value: function () {
      this.emitSelected()
    }
  },
  created () {
    // emit inital state
    if (this.default != null) {
      this.value = this.default
    }
    this.emitSelected()
  }
}
</script>

<style scoped>
  .dropdown >>> .dropdown-menu > div > a.dropdown-item.is-active {
    background-color: #8c67ef;
  }
</style>
