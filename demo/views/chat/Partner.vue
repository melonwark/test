<template>
  <div>
    <h2>TFChat</h2>
    <section class="section">
      <div class="grid-container">
        <div class="col-12">
          <TFChat
            :user-role="ROLES.partner"
            api-url="http://localhost:5174"
            :dialog_id="1"
            :roles="ROLES"
          >
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
          </TFChat>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="grid-container">
        <div class="col-12">
          Настройки те же что и в <a href="/chat/admin">админском чате</a>
        </div>
      </div>
    </section>
  </div>
</template>
<script  lang="ts">
import { TFChat } from '../../../src';
import { useRoute } from 'vue-router';

export default {
  name: 'ChatPage',
  components: {  TFChat },
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
