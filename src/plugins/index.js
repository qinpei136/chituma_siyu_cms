/* 公共引入,勿随意修改,修改时需经过确认 */
import "@/colorfulIcon";
import ByuiQueryForm from "@/components/ByuiQueryForm";
import ByuiQueryFormBottomPanel from "@/components/ByuiQueryForm/ByuiQueryFormBottomPanel";
import ByuiQueryFormLeftPanel from "@/components/ByuiQueryForm/ByuiQueryFormLeftPanel";
import ByuiQueryFormRightPanel from "@/components/ByuiQueryForm/ByuiQueryFormRightPanel";
import ByuiQueryFormTopPanel from "@/components/ByuiQueryForm/ByuiQueryFormTopPanel";
import toKeep from "@/components/toKeep/index";
import UploadImage from "@/components/upload";
import UploadImg from "@/components/UploadImg/index";
import "@/config/permission";
import drag from "@/directive/drag";
import permission from "@/directive/permission";
import "@/remixIcon";
import "@/styles/byui.scss";
import byui from "@/utils/byui";
import "@/utils/errorLog";
import "normalize.css";
import Vue from "vue";
import VueCropper from "vue-cropper";
import "./byuiIcon";
import "./element";
import "./f12";
import "./support";

Vue.use(permission);
Vue.use(drag);
Vue.use(byui);

Vue.use(VueCropper);

Vue.component("byui-query-form", ByuiQueryForm);
Vue.component("byui-query-form-left-panel", ByuiQueryFormLeftPanel);
Vue.component("byui-query-form-right-panel", ByuiQueryFormRightPanel);
Vue.component("byui-query-form-top-panel", ByuiQueryFormTopPanel);
Vue.component("byui-query-form-bottom-panel", ByuiQueryFormBottomPanel);
Vue.component("upload-img", UploadImg);

Vue.component("upload-image", UploadImage);
Vue.component("ToKeep", toKeep);
