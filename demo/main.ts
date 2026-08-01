import './assets/styles/main.css';
import { createApp, h } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { confirmation, FloatingVue } from '../src';
import Home from './views/Home.vue';
import Sidebar from './views/Sidebar.vue';
import Multiselect from './views/Multiselect.vue';
import Datepicker from './views/Datepicker.vue';
import Table from './views/Table.vue';
import Modal from './views/Modal.vue';
import Dropdown from './views/Dropdown.vue';
import Button from './views/Button.vue';
import Toast from './views/Toast.vue';
import Badge from './views/Badge.vue';
import Card from './views/Card.vue';
import VueClipboard from 'vue3-clipboard';

import Input from './views/Input.vue';
import InputCheckbox from './views/InputCheckbox.vue';
import InputFile from './views/InputFile.vue';
import InputRadio from './views/InputRadio.vue';
import InputHidden from './views/InputHidden.vue';
import Textarea from './views/Textarea.vue';

import Prism from './components/Prism.vue';

const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: Home,
    },
    {
      path: '/sidebar',
      name: 'SidebarPage',
      component: Sidebar,
    },
    {
      path: '/multiselect',
      name: 'MultiselectPage',
      component: Multiselect,
    },
    {
      path: '/datepicker',
      name: 'DatepickerPage',
      component: Datepicker,
    },
    {
      path: '/table',
      name: 'TablePage',
      component: Table,
    },
    {
      path: '/modal',
      name: 'ModalPage',
      component: Modal,
    },
    {
      path: '/admin/support/:id',
      component: () => import('./views/chat/Admin.vue'),
      name: 'ChatAdminAlias',
    },
    {
      path: '/admin/support/',
      redirect: '/chat/admin'
    },
    {
      path: '/chat/admin',
      name: 'ChatAdminPage',
      component: () => import('./views/chat/Admin.vue'),
    },
    {
      path: '/chat/partner',
      name: 'ChatPartnerPage',
      component: () => import('./views/chat/Partner.vue'),
    },
    {
      path: '/dropdown',
      name: 'DropdownPage',
      component: Dropdown,
    },
    {
      path: '/button',
      name: 'ButtonPage',
      component: Button,
    },
    {
      path: '/toast',
      name: 'ToastPage',
      component: Toast,
    },
    {
      path: '/badge',
      name: 'BadgePage',
      component: Badge,
    },
    {
      path: '/card',
      name: 'CardPage',
      component: Card,
    },
    {
      path: '/inputs/text',
      name: 'InputPage',
      component: Input,
    },
    {
      path: '/inputs/checkbox',
      name: 'InputCheckboxPage',
      component: InputCheckbox,
    },
    {
      path: '/inputs/file',
      name: 'InputFilePage',
      component: InputFile,
    },
    {
      path: '/inputs/textarea',
      name: 'TextareaPage',
      component: Textarea,
    },
    {
      path: '/inputs/radio',
      name: 'InputRadioPage',
      component: InputRadio,
    },
    {
      path: '/inputs/hidden',
      name: 'InputHiddenPage',
      component: InputHidden,
    },
  ]
});

const app = createApp(App);

const customLink = {
  name: 'CustomLink',
  props: ['item'],
  render() {
    return h('a', this.$slots.default());
  }
};

app.component('custom-link', customLink);
app.component('prism-code', Prism);

app.use(router);
app.use(FloatingVue);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.confirmation = confirmation;

app.mount('#app');
