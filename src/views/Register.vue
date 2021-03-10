<template>
  <section id="hero">
    <div class="hero-container">
      <h1>Regisztráció</h1>
      <div class="container-fluid pt-5">
        <div class="row">
          <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            <div class="user-form">
              <div class="card">
                <div class="card-body pt-5 pb-5">
                  <register-component/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RegisterComponent from '../components/RegisterComponent.vue';

export default {
  components: { RegisterComponent }
};
</script>

<style>
</style>

   