import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./css/main.css";
import axios from "axios";
import TabIndex from "./js/TabIndexEnum";
import emitter from "tiny-emitter/instance";
import MISAEnum from "./js/MISAEnum";

const app = createApp(App);

app.use(router);

const globalProps = app.config.globalProperties;
globalProps.$router = router;
globalProps.$axios = axios;
globalProps.$TabIndex = TabIndex;
globalProps.$msemitter = emitter;
globalProps.$MISAEnum = MISAEnum;

app.mount("#app");

export { globalProps };
