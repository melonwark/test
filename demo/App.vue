<template>
  <header
    class="header"
    :class="{'sidebar-closed': sidebarState}"
  >
    <div>
      <TFSidebarToggle
        data-cy="menu_button"
        :collapsed="sidebarState"
      ></TFSidebarToggle>
    </div>
  </header>
  <main
    class="main"
    :class="{'sidebar-closed': sidebarState}"
  >
    <router-view></router-view>
  </main>
  <TFSidebar
    :menu="sidebarMenu"
    :hide-toggle="true"
    :related-selectors="['main', 'header']"
    :collapsed="sidebarState"
    :has-custom-link-component="false"
  >
    <template #header>
      <div class="sidebar-header">
        <div class="sidebar-header__logo">
          Traffic UI Kit
        </div>
      </div>
    </template>
  </TFSidebar>
</template>

<script setup lang="ts">
import { TFSidebar, TFSidebarToggle } from '../src';
import sidebarMenu from './constans/sidebar-menu';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

const sidebarState = cookies.get('sidebar_menu_closed') === 'true';

</script>

<style scoped>
  .main {
    width: 100%;
    padding: 76px 20px 20px 275px;
    transition: 0.3s ease;
  }

  .main.sidebar-closed{
    padding-left: 85px;
    @media (max-width: 768px) {
      padding-left: 0;
    }
  }
</style>
