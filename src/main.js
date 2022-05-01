import Vue from 'vue';
import App from './App.vue';
import * as Sentry from '@sentry/vue';

Vue.config.productionTip = false;

if(SENTRY)
{
	Sentry.init({
		Vue,
		dsn: "https://59a665141a10423b9aadc74699d8f05c@o364082.ingest.sentry.io/6218976",
		logErrors: true
	});
}

new Vue({
	render: function (h) {
		return h(App)
	}
}).$mount('#app');
