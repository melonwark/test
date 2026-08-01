<template>
  <div>
    <h2>TFChat Admin</h2>

    <section class="section">
      <div class="grid-container">
        <div class="col-12">
          <TFChat
            :user-role="ROLES.admin"
            api-url="http://localhost:5174"
            :dialog-id="dialogId"
            has-admin-dialog-list
            :roles="ROLES"
          >
            <template #dialog-list-item-avatar>
              <img
                style="{
                  border-radius: 9999px;
                  width: 3rem;
                  height: 3rem;
                }"
                src="../../assets/images/recipient.svg"
                alt="avatar"
              >
            </template>
            <template #message-avatar>
              <img
                class="tf-chat-message__avatar"
                src="../../assets/images/recipient.svg"
                alt="avatar"
              >
            </template>
            <template #message-avatar-reverse>
              <img
                class="tf-chat-message__avatar"
                src="../../assets/images/support-manager.svg"
                alt="avatar"
              >
            </template>
            <template #message-is-read>
            </template>
            <template #send-msg-btn-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style="width: 24px; height: 24px; transform: rotate(90deg)"
                class="h-6 w-6 ml-2 transform rotate-90"
              >
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                />
              </svg>
            </template>
            <template #create-dialog-btn-icon>
              <svg
                width="21"
                height="21"
                viewBox="0 0 32 32"
              >
                <path
                  d="M21.331 10.669v-7.997h-18.659v14.394h7.997v7.997h11.063l4.265 4.264h0.665v-4.264h2.666v-14.394h-7.997zM3.738 16v-12.262h16.527v6.931h-9.596v5.331h-6.931zM28.262 23.997h-2.666v3.422l-3.423-3.422h-10.439v-12.262h16.527v12.262z"
                  fill="currentColor"
                ></path>
              </svg>
            </template>
          </TFChat>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="grid-container">
        <div class="col-12">
          <prism-code>
            {{ `
<TFChat
  :user-role="ROLES.admin"
  api-url="http://localhost:5174"
  :dialog-id="dialogId"
  has-admin-dialog-list
  :roles="ROLES"
>
  <template #dialog-list-item-avatar>
    <img
      style="{
        border-radius: 9999px;
        width: 3rem;
        height: 3rem;
      }"
      src="../../assets/images/recipient.svg"
      alt="avatar"
    >
  </template>
  <template #message-avatar>
  </template>
  <template #message-avatar-reverse>
  </template>
  <template #message-is-read>
  </template>
  <template #send-msg-btn-icon>
  </template>
  <template #create-dialog-btn-icon>
  </template>
</TFChat>
 ` }}
          </prism-code>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Входные параметры (Props)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <table class="tf-table-demo">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>По умолчанию</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>hasAdminDialogList</td>
                <td>Boolean</td>
                <td>Определяет, нужно ли показывать список диалогов(Используется для админских ролей)</td>
                <td>false</td>
              </tr>
              <tr>
                <td>roles</td>
                <td>Object</td>
                <td>Список существующих ролей {[key: string]: number} ({ admin: 1, super_admin: 2, partner: 3, manager: 5, master: 6 })</td>
                <td>Обязателен</td>
              </tr>
              <tr>
                <td>dialogId</td>
                <td>String | Number</td>
                <td>ID  диалога (нужен, если используется hasAdminDialogList)</td>
                <td>undefined</td>
              </tr>
              <tr>
                <td>userRole</td>
                <td>String | Number</td>
                <td>Роль юзера, использующего чат</td>
                <td>""</td>
              </tr>
              <tr>
                <td>apiUrl</td>
                <td>String</td>
                <td>URL для запросов</td>
                <td>""</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Слоты (Slots)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <table class="tf-table-demo">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#dialog-list-item-avatar</td>
                <td>Иконка юзера в списке диалогов</td>
              </tr>
              <tr>
                <td>#message-avatare</td>
                <td>Иконка сообщения юзера-собеседника в чате</td>
              </tr>
              <tr>
                <td>##message-avatar-reverse</td>
                <td>Иконка сообщения юзера в чате</td>
              </tr>
              <tr>
                <td>#message-is-read</td>
                <td>Иконка о прочтении собеседником в админском чате </td>
              </tr>
              <tr>
                <td>#send-msg-btn-icon</td>
                <td>Иконка отправки сообщения</td>
              </tr>
              <tr>
                <td>#create-dialog-btn-icon</td>
                <td>Иконка создания чата в админском чате</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
<script  lang="ts">
import { TFChat } from '../../../src';
import { useRoute } from 'vue-router';
import PrismCode from '../../components/Prism.vue';


export default {
  name: 'ChatAdminPage',
  components: {  TFChat, PrismCode },
  setup() {
    const ROLES = {
      admin: 1,
      super_admin: 2,
      partner: 3,
      manager: 5,
      master: 6
    };

    const route = useRoute();
    const dialogId = route.params.id;

    return {
      ROLES,
      dialogId
    };
  }
};

</script>
