<template>
  <div style="padding-bottom: 16px">

    <b-collapse class="card" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
            {{ title }}
        </p>
        <a class="card-header-icon">
          <b-icon type="is-purp" pack="fas" :icon="props.open ? 'chevron-up' : 'chevron-down'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content" v-html="content"></div>
      </div>
    </b-collapse>

  </div>
</template>

<script>

export default {
  name: 'buefy-card-collapse',
  props: ['title', 'content']
}
</script>
