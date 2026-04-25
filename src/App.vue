<template>
  <router-view 
    class="template-view"
  />
</template>

<script setup>
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  color: #000000;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

* {
  box-sizing: border-box;
  /* border: 1px solid red; */
}

/*****************
 * General Style
 *****************/

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.template-view {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* image */
.img-box {
  background-color: #fdfbf7;
  border-radius: 20px;
  border: 1px solid #8e8d8d;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

.img-box-square {
  /* width: 100%; */
  /* max-width: 180px; */
  aspect-ratio: 1 / 1; 
}
.img-box-vertical {
  /* width: 100%; */
  /* max-width: 180px; */
  aspect-ratio: 3 / 4;
}
.img-box-horizontal {
  /* width: 100%; */
  /* max-width: 240px; */
  aspect-ratio: 4 / 3;
}

.img-restrict-big img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* object-fit: scale-down; */
}
.img-restrict img, .img-restrict-small img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* object-fit: scale-down; */
}
.video-restrict-big video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}
.video-restrict-small video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  overflow: hidden;
}

/* button */
.base-btn {
  background-color: #fdfbf7;
  border: 1px solid #000000;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  outline: none;
}
.default-btn {
  padding: 15px 0;
  border-radius: 12px;
  font-weight: bold;
  color: #333;
}
.animate-btn:active {
  transition: all 0.2s ease;
  background-color: #bbb;
}

/* text */
.default-font {
  font-size: clamp(14px, 3vmin, 80px);
  line-height: 1.6;
  font-family: 'Times New Roman', serif;
  letter-spacing: 2px;
  color: #000000;
  font-weight: normal;
}

.relative-text-wrapper {
  container-type: size;
}
.relative-text-width-wrapper {
  container-type: inline-size;
}

.title {
  font-weight: bold;
  white-space: nowrap;
  font-size: clamp(16px, 4vmin, 120px);
  line-height: 1.2;
}
.title-tw {
  letter-spacing: 3px;
  margin: 0 0 8px 0;
}
.title-en {
  letter-spacing: 1px;
  margin: 0;
}

/* 漸層捲動遮罩 */
/* 動態文字捲動遮罩 */
.scroll-mask-container {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox 隱藏捲動條 */
  
  /* 預設值為 0%，由 JS 動態賦予實際的模糊比例 */
  --mask-top: 0%;
  --mask-bottom: 0%;

  /* 核心遮罩 */
  --mask-image-content: linear-gradient(
    to bottom,
    transparent 0%,
    black var(--mask-top),
    black calc(100% - var(--mask-bottom)),
    transparent 100%
  );

  -webkit-mask-image: var(--mask-image-content);
  mask-image: var(--mask-image-content);
}

.scroll-mask-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari 隱藏捲動條 */
}

::selection {
  background: #333333; /* 深灰色背景 */
  color: #fdfbf7;      /* 米白色文字 */
}
</style>
