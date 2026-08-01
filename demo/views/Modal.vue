<template>
  <div>
    <section class="section">
      <h2>TFModal</h2>
      <div class="grid-container">
        <div class="col-6">
          <div
            class="tf-modal"
            style="max-width: 500px;"
          >
            <div class="tf-modal-header">
              <h4 class="tf-modal-title">
                Заголовок
              </h4>
              <button
                type="button"
                aria-hidden="true"
                class="tf-modal-close"
              >
                ×
              </button>
            </div>
            <div class="tf-modal-body">
              <p>Основной контент</p>
            </div>
            <div class="tf-modal-footer">
              <button class="tf-btn tf-btn-md tf-btn-danger">
                Close
              </button>
              <button class="tf-btn tf-btn-md tf-btn-success">
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="grid-container">
        <div class="col-12">
          <p>В шаблонах vue вызов методов компонента осуществляется при помощи атрибута <code>ref</code></p>

          <prism-code>
            {{ `

&lt;TFModal ref="modalRef">&lt;/TFModal>

&lt;TFButton @click="openModal">
  Open modal
&lt;/TFButton>

setup() {
  const modalRef = ref(null);

  const openModal = () => {
    modalRef.value.openModal();
  };

  const closeModal = () => {
    modalRef.value.closeModal();
  };

  return {
    modalRef,
    openModal,
    closeModal
  };
} ` }}
          </prism-code>

          <TFModal ref="modalRef1">
            <template #modal-title>
              Modal TiTle
            </template>
            <template #modal-body>
              <h3>Modal Body</h3>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie, neque eu rutrum porttitor, nisl justo sollicitudin leo, vel dignissim nulla dui sit amet est. Aliquam eleifend mattis metus, eu tempus diam auctor vitae. Etiam nec malesuada eros. Donec elementum eros vel condimentum mollis. Donec a egestas enim, eget bibendum nibh. Vivamus pretium malesuada egestas. Sed tempus faucibus lacus. Ut sit amet viverra dui. Mauris lacus arcu, tincidunt ac consequat eu, imperdiet vel diam. Fusce tristique ante at ullamcorper porta. Fusce id velit ante. Nullam tempus sem vitae quam sodales placerat.
              Maecenas laoreet bibendum dolor sit amet tincidunt. Fusce eu dolor semper, accumsan risus nec, euismod nulla. Nam quis viverra tellus. Proin rutrum neque quis libero efficitur, quis consectetur risus rutrum. Morbi dapibus sagittis eros a finibus. In hac habitasse platea dictumst. Nam fringilla feugiat ipsum quis tempus. Quisque aliquet urna a felis volutpat, non convallis nibh feugiat. Quisque a ligula at dui scelerisque semper. Aliquam ipsum dui, blandit non egestas eget, ornare eu felis. Integer aliquam lacus semper nibh accumsan consequat. Nulla vel tempor odio. Nam arcu arcu, efficitur a massa vitae, pretium egestas ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus aliquam placerat mi eu dapibus.
              Donec eget quam nisi. Sed at ligula mattis, lacinia magna nec, euismod ante. Mauris nec pretium nulla. Duis non hendrerit leo. Vestibulum dignissim nulla et tellus feugiat porta. Proin mauris ipsum, imperdiet sed nulla at, vulputate tincidunt leo. Aenean id eleifend justo, quis luctus lorem. Nam condimentum quam ut est maximus tincidunt. In vel cursus elit, vitae venenatis nisl. Suspendisse sit amet scelerisque mi. Aliquam suscipit justo vehicula suscipit gravida.
              Vivamus id tempus risus. Sed augue justo, egestas vel pellentesque a, bibendum sed lectus. Ut aliquam dolor ac tincidunt molestie. Aenean in auctor nunc. Vestibulum rhoncus sapien diam, in molestie erat placerat ut. Vestibulum vel ullamcorper purus. Vivamus non ullamcorper turpis. Sed pulvinar volutpat magna, at consequat ligula varius lacinia. Integer vel lorem tempor, eleifend ante id, ultricies lacus. Vestibulum fermentum sem at purus pulvinar fringilla. Vivamus a enim sem. Cras eget erat laoreet, auctor sem vel, euismod eros.
              Proin accumsan pellentesque ante et luctus. Quisque venenatis hendrerit velit. Donec blandit ligula mattis nisl rutrum efficitur. Donec in dapibus leo, at mollis diam. Duis et vulputate quam, a ornare est. Duis elit orci, posuere id posuere a, facilisis at elit. Proin erat lorem, vestibulum in fermentum vitae, feugiat vitae nulla. Morbi nec arcu sed quam viverra elementum. Mauris facilisis lectus molestie nunc sagittis, id porta nunc finibus. Fusce aliquet arcu et pretium pulvinar.
              Nam nec porttitor nibh. Sed lectus mi, interdum non magna at, viverra scelerisque ante. Duis pellentesque ac nisi quis ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam ultrices, magna non porttitor vulputate, metus lacus tincidunt dolor, vitae consequat ante nisi vel arcu. Donec vitae nisi a arcu convallis tristique. Integer eu orci orci. Donec eget auctor dolor. Maecenas facilisis velit non aliquam consequat. Mauris consectetur semper vulputate. Etiam luctus odio sit amet purus porttitor, quis sodales libero euismod. Sed ullamcorper hendrerit erat, eget cursus felis egestas a. Nulla aliquam, erat commodo iaculis rutrum, ante neque iaculis erat, non mattis augue erat a erat.
            </template>
            <template #modal-footer>
              Modal Footer
            </template>
          </TFModal>
          <TFButton
            @click="openModal"
          >
            Open modal
          </TFButton>
        </div>
        <div class="col-12">
          В шаблонах blade можно использовать eventBus событие с передачей параметров
          в пропсы слотов. Для этого необходимо указать cобытие для прослушивания <code>event</code>
          В компоненте, отправляющем событие указать в параметрах <code>modalId</code> - id модального окна
          и <code>action</code> - <b>"openModal"</b> или <b>"closeModal"</b>

          <prism-code>
            {{ `
&lt;tf-modal
  :modal-id="modalId"
  event="blade_template_open_modal"
>
  &lt;template #modal_title>Title&lt;/template>
  &lt;template #modal_body="{ params }">
    &lt;div>params1 - @{ params.data.key }&lt;/div>
  &lt;/template>
  &lt;template #modal_footer="{ params }">
    &lt;div>params2 - @{ params.data.key1 }&lt;/div>
  &lt;/template>
&lt;/tf-modal>

&lt;tf-button
  :default-click-emitter="{
    event: 'blade_template_open_modal',
    params: {
      modalId: 'modalId',
      action: 'openModal',
      data: {
        key: 'value',
        key1: 'value1'
      }
    }
  }"
>
  Open blade template modal
&lt;tf-button>
            ` }}
          </prism-code>

          <TFModal
            modal-id="modalId"
            event="blade_template_open_modal"
          >
            <template #modal-title>
              Title
            </template>
            <template #modal-body="{ params }">
              <div>params1 - {{ params.data?.key }}</div>
            </template>
            <template #modal-footer="{ params }">
              <div>params2 - {{ params.data?.key1 }}</div>
            </template>
          </TFModal>
          <TFButton
            :default-click-emitter="{
              event: 'blade_template_open_modal',
              params: {
                modalId: 'modalId',
                action: 'openModal',
                data: {
                  key: 'value',
                  key1: 'value1'
                }
              }
            }"
          >
            Open blade template modal
          </TFButton>
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
                <td>modalId</td>
                <td>String</td>
                <td>Атрибут id, по нему определяется, какое окно использовать</td>
                <td>"modal"</td>
              </tr>
              <tr>
                <td>event</td>
                <td>String</td>
                <td>Имя события eventBus, которое нужно прослушивать</td>
                <td>""</td>
              </tr>
              <tr>
                <td>modalWidth</td>
                <td>String</td>
                <td>max-width окна</td>
                <td>"500px"</td>
              </tr>
              <tr>
                <td>closingOnlyWithButtons</td>
                <td>Boolean</td>
                <td>Запретить закрытие при клике вне окна</td>
                <td>false</td>
              </tr>
              <tr>
                <td>modalContainerClasses</td>
                <td>String</td>
                <td>Кастомные классы модального окна</td>
                <td>""</td>
              </tr>
              <tr>
                <td>modalFooterClasses</td>
                <td>String</td>
                <td>Кастомные классы подвала окна</td>
                <td>""</td>
              </tr>
              <tr>
                <td>modalHeaderClasses</td>
                <td>String</td>
                <td>Кастомные классы шапки окна</td>
                <td>""</td>
              </tr>
              <tr>
                <td>modalMaskClasses</td>
                <td>String</td>
                <td>Кастомные классы overlay окна</td>
                <td>""</td>
              </tr>
              <tr>
                <td>modalBodyClasses</td>
                <td>String</td>
                <td>Кастомные классы основного контента окна</td>
                <td>""</td>
              </tr>
              <tr>
                <td>isOpen</td>
                <td>Boolean</td>
                <td>Должно ли быть открыто сразу</td>
                <td>false</td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  style="text-align: center"
                >
                  <b>Teleport</b> - см.
                  <a href="https://vuejs.org/guide/built-ins/teleport">документацию</a>
                </td>
              </tr>
              <tr>
                <td>parent</td>
                <td>String</td>
                <td>Предназначен для определения родителя в DOM (селектор)</td>
                <td>'body'</td>
              </tr>
              <tr>
                <td>disabledParent</td>
                <td>Boolean</td>
                <td>
                  "Отключает" родителя, компонент будет добавлен в DOM в том месте,
                  где был объявлен в коде
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>defer</td>
                <td>Boolean</td>
                <td>
                  Откладывает вставку компонента до тех пор пока не будут смонтированы
                  остальные части/компоненты.
                </td>
                <td>false</td>
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
                <td>#modal-header-content</td>
                <td>Если потребуется задать/изменить контент шапки (кроме кнопки закрытия)</td>
              </tr>
              <tr>
                <td>#modal-title</td>
                <td>Заголовок в шапке</td>
              </tr>
              <tr>
                <td>#modal-close-icon</td>
                <td>Иконка закрытия</td>
              </tr>
              <tr>
                <td>#modal-body</td>
                <td>Основной контент</td>
              </tr>
              <tr>
                <td>#modal-footer</td>
                <td>Подвал окна</td>
              </tr>
            </tbody>
          </table>
          Все слоты имеют входные параметры (props)
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { TFModal, eventBus, TFButton } from '../../src';
import PrismCode from '../components/Prism.vue';
import { ref } from 'vue';

export default {
  name: 'ModalPage',
  components: { TFButton, TFModal, PrismCode },
  setup() {
    const modalRef1 = ref(null);

    const openModal = () => {
      modalRef1.value.openModal();
    };

    return {
      modalRef1,
      openModal,
      eventBus
    };
  }
};
</script>
