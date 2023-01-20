import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/fa-IR'
import { router } from './router/index'
//import './css/quasar-variables.scss'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
  /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  */
})

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app')