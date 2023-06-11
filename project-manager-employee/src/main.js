import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./css/main.css";
import axios from "axios";
import TabIndex from "./js/TabIndexEnum";
import emitter from "tiny-emitter/instance";
import MISAEnum from "./js/MISAEnum";
import MISAResource from "./js/MISAResource";
import DeleteType from "./js/DeleteTypeEnum";
import EntityEnum from "./config/EntityEnum";
import ShortCutKey from "./js/ShortKeyResource";
import MagicNumberEnum from "./js/MagicNumberEnum";
import BehaviorHandleEnum from "./js/BehaviorHandleEnum";
import DialogTypeEnum from "./js/DialogTypeEnum";

const app = createApp(App);
app.use(router);

const globalProps = app.config.globalProperties;
globalProps.$router = router;
globalProps.$axios = axios;
globalProps.$TabIndex = TabIndex;
globalProps.$msemitter = emitter;
globalProps.$MISAEnum = MISAEnum;
globalProps.$MISAResource = MISAResource;
globalProps.$ShortCutResource = ShortCutKey;
globalProps.$MagicNumber = MagicNumberEnum;
globalProps.$EntityEnum = EntityEnum;
globalProps.$BehaviorHandleEnum = BehaviorHandleEnum;
globalProps.$DialogTypeEnum = DialogTypeEnum;
globalProps.$DeleteType = DeleteType;

app.mount("#app");

export { globalProps };
