import { createApp } from 'vue'
import App from './App.vue'
// import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import BalmUI from 'balm-ui' // Official Google Material Components
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus' // BalmJS Team Material Components
import 'balm-ui-css'
import $theme from 'balm-ui/plugins/theme'

loadFonts()

createApp(App)
  // .use(vuetify)
  .use(BalmUI)
  .use($theme, {
    primary: '#ff5722',
    secondary: '#ff5722',
  })
  // .use(BalmUIPlus)
  .mount('#app')
