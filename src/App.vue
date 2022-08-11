<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./components/Header"
export default {
  components: {
    Header
  },
  name: 'App',
}
</script>
