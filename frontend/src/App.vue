<template>
  <div id="app">
    <Iptc msg="Welcome to IPTC edit App"/>
  </div>
</template>

<script>
import Iptc from './components/Iptc.vue'

export default {
  name: 'App',
  components: {
    Iptc
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
