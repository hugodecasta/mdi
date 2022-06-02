import { createApp, reactive } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import api from './plugins/api.js'
import './plugins/api.js'

api.install = app => app.mixin({
  computed: {
    $api() {
      return reactive(api)
    }
  }
})

loadFonts()

createApp(App)
  .use(vuetify)
  .use(api)
  .mount('#app')
