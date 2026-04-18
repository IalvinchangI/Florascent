

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
