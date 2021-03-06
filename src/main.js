import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import store from '@/store';
import router from '@/router';
import App from '@/App';
import validation from './validation';
import '@endpass/ui/kit/kit.theme-default.css';
import i18n from '@/locales/i18n';
import e2eSetup from '@/util/e2eSetup';

(async () => {
  try {
    if (!window.parent.e2eBridge) {
      throw new Error();
    }

    await e2eSetup();

    /* eslint-disable-next-line */
  } catch (e) {}

  Vue.use(validation);
  Vue.use(VShowSlide);
  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
    store,
    i18n,
    router,
  }).$mount('#app');
})();
