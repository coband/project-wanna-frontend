<template>
  <div class="card shadow-sm p-4">
    <h2 class="card-title text-center text-primary">Scanner</h2>
    <div class="d-flex flex-column align-items-center">
      <video
        ref="video"
        class="border rounded mb-3"
        autoplay
        playsinline
        @loadeddata="onVideoLoaded"
      ></video>

      <div v-if="result" class="alert alert-info text-center w-100">
        <h5 class="alert-heading">Scan-Ergebnis:</h5>
        <p>{{ result }}</p>
        <div v-if="bookInfo">
          <p><strong>Titel:</strong> {{ bookInfo.title }}</p>
          <p><strong>Autor:</strong> {{ bookInfo.author }}</p>
          <p><strong>ISBN:</strong> {{ bookInfo.isbn }}</p>
          <p><strong>Fachgebiet:</strong> {{ bookInfo.subject }}</p>
          <p>
            <strong>Erscheinungsjahr:</strong> {{ bookInfo.published_date }}
          </p>
        </div>
      </div>

      <div class="mt-3">
        <button
          @click="startScanning"
          class="btn btn-primary me-2"
          v-if="!isScanning"
        >
          Scanner starten
        </button>
        <button @click="stopScanning" class="btn btn-danger" v-if="isScanning">
          Scanner stoppen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const result = ref(null);
const bookInfo = ref(null);
const isScanning = ref(false);
const video = ref(null);
const stream = ref(null);
const selectedDeviceId = ref(null);

const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    if (videoDevices.length > 0) {
      selectedDeviceId.value = videoDevices[0].deviceId;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Geräte:", error);
  }
};

const startScanning = async () => {
  isScanning.value = true;
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedDeviceId.value
          ? { exact: selectedDeviceId.value }
          : undefined,
      },
    });
    video.value.srcObject = stream.value;
  } catch (error) {
    console.error("Fehler beim Zugriff auf die Kamera:", error);
  }
};

const stopScanning = () => {
  isScanning.value = false;
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
  }
};

const postISBN = async (isbn) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/fetch_book_isbn/?isbn=${isbn}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("API response:", data);
  } catch (error) {
    console.error("Error posting ISBN:", error);
  }
};

const onVideoLoaded = async () => {
  await scan();
};

const scan = async () => {
  const barcodeDetector = new BarcodeDetector({ formats: ["ean_13"] });
  while (isScanning.value) {
    try {
      const barcodes = await barcodeDetector.detect(video.value);
      if (barcodes.length > 0) {
        result.value = barcodes[0].rawValue;
        await postISBN(result.value);
        stopScanning();
      }
    } catch (error) {
      console.error("Error detecting barcodes:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

onMounted(() => {
  getDevices();
});

onUnmounted(() => {
  stopScanning();
});
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
}
video {
  max-width: 100%;
  height: auto;
  border: 2px solid #ddd;
}
</style>
