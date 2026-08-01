<template>
  <div>
    <h2>TFCard</h2>
    <section class="section">
      <div class="grid-container">
        <div class="col-4">
          <TFCard>
            <template #preview>
              <img
                src="../assets/images/card-image.png"
                alt="img"
              />
            </template>
            <p>Card Content</p>
          </TFCard>
        </div>
        <div class="col-4">
          <TFCard>
            <template #preview>
              <img
                src="../assets/images/card-image.png"
                alt="a"
              />
              <div class="tf-card-preview-description">
                Card Preview Additional Information
              </div>
            </template>
            <p>Card Content</p>
          </TFCard>
        </div>
        <div class="col-4">
          <TFCard>
            <template #header>
              Card Header
            </template>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium architecto assumenda dignissimos dolorem,
              doloribus eius est laborum magni maiores mollitia necessitatibus
              perferendis perspiciatis quae quo sed sint temporibus tenetur totam.
            </p>
            <template #footer>
              <p>Card Footer</p>
            </template>
          </TFCard>
        </div>
        <div class="col-4">
          <TFCard>
            <template #header>
              card header
            </template>
            <template #preview>
              <img
                src="../assets/images/card-image.png"
                alt="a"
              />
              <div class="tf-card-preview-description">
                Card Preview Additional Information
              </div>
            </template>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium architecto assumenda dignissimos dolorem,
              doloribus eius est laborum magni maiores mollitia necessitatibus
              perferendis perspiciatis quae quo sed sint temporibus tenetur totam.
            </p>
            <template #footer>
              <TFButton>Button</TFButton>
            </template>
          </TFCard>
        </div>
        <div class="col-8">
          <TFCard>
            <template #header>
              title
            </template>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium architecto assumenda dignissimos dolorem,
              doloribus eius est laborum magni maiores mollitia necessitatibus
              perferendis perspiciatis quae quo sed sint temporibus tenetur totam.
            </p>
          </TFCard>
        </div>
        <div class="col-12">
          <prism-code>
            {{ `
&lt;TFCard>
  &lt;template #header>
    card header
  &lt;/template>
  &lt;template #preview>
    &lt;img
      src="../assets/images/card-image.png"
      alt="a"
    />
    &lt;div class="tf-card-preview-description">
      Card Preview Additional Information
    &lt;/div>
  &lt;/template>

  &lt;p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    Accusantium architecto assumenda dignissimos dolorem,
    doloribus eius est laborum magni maiores mollitia necessitatibus
    perferendis perspiciatis quae quo sed sint temporibus tenetur totam.
  &lt;/p>

  &lt;template #footer>
    &lt;TFButton>Button&lt;/TFButton>
  &lt;/template>
&lt;/TFCard>
        ` }}
          </prism-code>
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
                <td>#header</td>
                <td>
                  Если присутствует, в разметку добавляется div c классом
                  <code>tf-card__header</code>.
                  Так же к контейнеру добавляется класс <code>has-header</code>
                </td>
              </tr>
              <tr>
                <td>#preview</td>
                <td>
                  Если присутствует, в разметку добавляется div c классом
                  <code>tf-card__preview</code>
                </td>
              </tr>
              <tr>
                <td>#footer</td>
                <td>
                  Если присутствует, в разметку добавляется div c классом
                  <code>tf-card__footer</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Стили (c учётом присутствия всех слотов)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <prism-code>
            {{ `
.tf-card {}

.tf-card.has-header {}

.tf-card__header {}

.tf-card__preview {}

.tf-card__content {}

.tf-card__footer {}
            ` }}
          </prism-code>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { TFCard, TFButton } from '../../src';


export default {
  name: 'CardPage',
  components: { TFButton, TFCard },

  setup() {
  }
};
</script>
