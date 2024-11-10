<template>
  <div class="card shadow-sm p-4">
    <h2 class="card-title text-center text-primary">Bücherliste</h2>
    <ul class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item">
        {{ book.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const books = ref([]);

const fetchBooks = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/books/");
    books.value = await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
