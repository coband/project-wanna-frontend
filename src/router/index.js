import { createRouter, createWebHistory } from "vue-router";
import BarcodeScanner from "../components/BarcodeScanner.vue";
import BookList from "../components/BookList.vue";

const routes = [
  { path: "/scanner", component: BarcodeScanner },
  { path: "/books", component: BookList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
