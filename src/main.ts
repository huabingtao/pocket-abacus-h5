import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/global.scss'
import 'vant/lib/index.css'
import { Button, Field, Picker, Popup, Tab, Tabs, Cell, CellGroup, RadioGroup, Radio, Checkbox, CheckboxGroup, Slider, Empty, Loading } from 'vant'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Button)
app.use(Field)
app.use(Picker)
app.use(Popup)
app.use(Tab)
app.use(Tabs)
app.use(Cell)
app.use(CellGroup)
app.use(RadioGroup)
app.use(Radio)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Slider)
app.use(Empty)
app.use(Loading)

app.mount('#app')
