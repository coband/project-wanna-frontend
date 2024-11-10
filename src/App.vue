<template>
  <div id="app" class="container mt-5">
    <!-- Titel -->
    <div class="text-center mb-5">
      <h1 class="display-4 text-primary fw-bold">📚 Wanna</h1>
    </div>

    <!-- Navigation -->
    <nav class="mb-4">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <router-link
            to="/scanner"
            class="nav-link"
            active-class="active"
            exact
          >
            Scanner
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/books" class="nav-link" active-class="active" exact>
            Bücherliste
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Platzhalter für die aktuelle Route -->
    <router-view></router-view>
  </div>
</template>

<script setup>
// Keine zusätzlichen Skripte erforderlich
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
