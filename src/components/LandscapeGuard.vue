<template>
  <div class="landscape-warning">
    <div class="content">
      <div class="phone-icon">
        <span></span>
      </div>
      <h2>請將手機轉為直向</h2>
      <p>Please rotate your phone to portrait mode</p>
    </div>
  </div>
</template>

<style scoped>
.landscape-warning {
  display: none;
}

@media screen and (orientation: landscape) {
  .landscape-warning {
    display: flex;
    justify-content: center;
    align-items: center;
    
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 99999;
    
    background-color: rgba(0, 0, 0, 1);
    color: white;
    text-align: center;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.phone-icon {
  width: 50px;
  height: 80px;
  border: 3px solid white;
  border-radius: 8px;
  position: relative;
  animation: rotate-phone 5s infinite ease-in-out;
}

.phone-icon::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
}
/* .phone-icon::after {
  content: '';
  position: absolute;
  top: 2px; 
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 4px;
  background: white;
  border-radius: 4px;
} */

@keyframes rotate-phone {
  0% { transform: rotate(-90deg); opacity: 0.5; }
  20% { transform: rotate(0deg); opacity: 1; }
  85% { transform: rotate(0deg); opacity: 1; }
  100% { transform: rotate(-90deg); opacity: 0.5; }
}

h2 {
  font-size: 1.5rem;
  letter-spacing: 2px;
  margin: 0;
}

p {
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
}
</style>
