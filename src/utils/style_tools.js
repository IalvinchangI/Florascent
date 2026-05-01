

/**
 * 計算捲動遮罩的 CSS 變數
 * @param {HTMLElement} element - 需要捲動的 DOM 元素
 * @param {string} fadeTopRatio - 頂部模糊比例
 * @param {string} fadeBottomRatio - 底部模糊比例
 * @returns {Object} 包含 CSS 變數的物件
 */
export function CalculateScrollMaskStyle(element, fadeTopRatio = "10%", fadeBottomRatio = "10%") {
  if (!element) {
    return { '--mask-top': '0%', '--mask-bottom': '0%' };
  }
  
  const { scrollTop, scrollHeight, clientHeight } = element;

  // 情況 A：內容太少不用捲動
  if (scrollHeight <= clientHeight) {
    return { '--mask-top': '0%', '--mask-bottom': '0%' };
  }

  // 情況 B：判斷是否滑到最頂或最底
  const isAtTop = scrollTop <= 0;
  const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;

  return {
    '--mask-top': isAtTop ? '0%' : fadeTopRatio,
    '--mask-bottom': isAtBottom ? '0%' : fadeBottomRatio
  };
}


export function GetRandomBarStyle() {
  // Positions (0% to 100%)
  const top = Math.random() * 100 + '%';
  const left = Math.random() * 100 + '%';
  
  // Size: 黑色長方形，我們讓 width 隨機，height 較細
  const width = Math.random() * 700 + 10 + 'px'; // 隨機長度 (10px to 710px)
  const height = Math.random() * 20 + 10 + 'px';  // 較細的水平線 (10px to 30px)
  
  // Animation Delay: 負的 delay 可以讓動畫 stagger 開來，看起來像隨機閃爍
  const delay = Math.random() * -3 + 's'; 

  return {
    top,
    left,
    '--base-width': width,
    height,
    animationDelay: delay, // Staggered start
  };
}
