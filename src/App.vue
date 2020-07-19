<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@charset "utf-8";
// import icons
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
@import "/assets/variables";

// Set your colors
$primary: $primary-colour;
$primary-invert: findColorInvert($primary);
$purp: $purple-colour;
$purp-invert: findColorInvert($purp);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "purp": ($purp, $purp-invert)
);

// bulma globals
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

$grey-darker: #666;
$text: #666;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

  ::-webkit-scrollbar-button {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
  }
  ::-webkit-scrollbar-thumb:hover {
      background-color: #666;
  }
  ::-webkit-scrollbar-track {
      background-color: #fff;
  }
  ::-webkit-scrollbar-track:hover {
      background-color: #fff;
  }
  ::-webkit-scrollbar {
      width: 13px;
  }
  .no-colour-border.is-genesys > .input {
    border-color: #dbdbdb!important;
    box-shadow: none!important;
    -webkit-box-shadow: none!important;
  }

</style>
