# テトリス ソースコード

以下はテトリスゲームの全ソースコードです。コピーしてご利用ください。

## index.html
```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>テトリス - Puzzle Game</title>
  <meta name="description" content="ブラウザで遊べるテトリス風パズルゲーム。キーボード操作でブロックを積み上げよう！">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;600&display=swap"
    rel="stylesheet">
</head>

<body>
  <!-- ===== Mode Select Screen ===== -->
  <div id="mode-select-screen" class="screen">
    <h1 class="game-title title-large">TETRIS</h1>
    <div class="mode-buttons">
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-endless" class="mode-btn">
          <span class="mode-icon">∞</span>
          <span class="mode-label">エンドレス</span>
          <span class="mode-desc">クラシックモード</span>
        </button>
        <div style="text-align: center; font-family: 'Orbitron', sans-serif;">
          <label for="start-level" style="color: #ccc; font-size: 0.9em; margin-right: 5px;">START LEVEL:</label>
          <input type="number" id="start-level" min="1" max="30" value="1"
            style="width: 60px; padding: 4px; border: 1px solid #00e5ff; background: #111; color: #00e5ff; border-radius: 4px; font-family: 'Orbitron', sans-serif; text-align: center; font-size: 1.1em;">
        </div>
      </div>
      <button id="btn-challenge-select" class="mode-btn">
        <span class="mode-icon">★</span>
        <span class="mode-label">チャレンジ</span>
        <span class="mode-desc">ステージクリア型</span>
      </button>
    </div>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
      <button id="btn-keyconfig" class="sub-btn">⚙ KEY CONFIG</button>
      <button id="btn-debug" class="sub-btn">🔧 DEBUG</button>
    </div>
  </div>

  <!-- ===== Challenge Select Screen ===== -->
  <div id="challenge-select-screen" class="screen hidden">
    <h1 class="game-title">CHALLENGE</h1>
    <p class="challenge-subtitle">難易度を選択</p>
    <div class="challenge-grid" id="challenge-grid">
      <!-- JS で生成 -->
    </div>
    <button id="btn-back-menu" class="back-btn">← MENU</button>
  </div>

  <!-- ===== Key Config Screen ===== -->
  <div id="keyconfig-screen" class="screen hidden">
    <h1 class="game-title">KEY CONFIG</h1>
    <div id="keyconfig-list" class="keyconfig-list"></div>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
      <button id="keyconfig-reset" class="sub-btn">↺ RESET</button>
      <button id="btn-keyconfig-back" class="back-btn">← MENU</button>
    </div>
  </div>

  <!-- ===== Debug Screen ===== -->
  <div id="debug-screen" class="screen hidden">
    <h1 class="game-title">DEBUG</h1>
    <div class="debug-panel">
      <h3>Challenge 直接開始</h3>
      <div style="display: flex; gap: 8px; align-items: center; margin: 8px 0;">
        <label style="color:#ccc;">CH:</label>
        <input type="number" id="debug-challenge" min="1" max="10" value="1"
          style="width:50px; padding:4px; background:#111; color:#00e5ff; border:1px solid #00e5ff; border-radius:4px; text-align:center;">
        <label style="color:#ccc;">STAGE:</label>
        <input type="number" id="debug-stage" min="1" max="5" value="1"
          style="width:50px; padding:4px; background:#111; color:#00e5ff; border:1px solid #00e5ff; border-radius:4px; text-align:center;">
        <button id="btn-debug-start" class="sub-btn">START</button>
      </div>
      <h3 style="margin-top:15px;">ご褒美プレビュー</h3>
      <div style="display: flex; gap: 8px; align-items: center; margin: 8px 0;">
        <label style="color:#ccc;">CH:</label>
        <input type="number" id="debug-reward-ch" min="1" max="10" value="1"
          style="width:50px; padding:4px; background:#111; color:#00e5ff; border:1px solid #00e5ff; border-radius:4px; text-align:center;">
        <button id="btn-debug-reward" class="sub-btn">PLAY</button>
      </div>
    </div>
    <button id="btn-debug-back" class="back-btn">← MENU</button>
  </div>

  <!-- ===== Reward Screen ===== -->
  <div id="reward-screen" class="screen hidden">
    <canvas id="reward-canvas" width="600" height="600"></canvas>
    <div id="reward-text-overlay" class="reward-text-overlay">
      <h2 id="reward-title"></h2>
      <p id="reward-sub"></p>
    </div>
    <button id="btn-reward-skip" class="reward-skip-btn">SKIP →</button>
  </div>

  <!-- ===== Game Screen ===== -->
  <div id="game-screen" class="screen hidden">
    <div class="game-wrapper">
      <h1 class="game-title">TETRIS</h1>
      <div class="game-container">
        <!-- Left Panel: Hold -->
        <div class="side-panel side-panel-left">
          <div class="panel-box hold-box">
            <h3>HOLD</h3>
            <canvas id="hold-canvas" width="120" height="120"></canvas>
          </div>
        </div>

        <!-- Board -->
        <div class="board-area">
          <canvas id="board" width="300" height="600"></canvas>

          <!-- Game Over / Clear Overlay -->
          <div id="game-over-overlay" class="overlay hidden">
            <div class="overlay-content">
              <h2 id="result-title">GAME OVER</h2>
              <p id="final-score-text">Score: 0</p>
              <button id="retry-btn">RETRY</button>
              <button id="menu-btn" class="menu-btn">MENU</button>
            </div>
          </div>

          <!-- Pause Overlay -->
          <div id="pause-overlay" class="overlay hidden">
            <div class="overlay-content">
              <h2>PAUSED</h2>
              <p class="pause-hint">Press ESC to resume</p>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="side-panel side-panel-right">
          <div id="challenge-info" class="panel-box challenge-box hidden">
            <h3 id="challenge-mode-label">CHALLENGE 1</h3>
            <h3 class="mt8">STAGE</h3>
            <p id="stage-display">1</p>
            <h3 class="mt8">TARGET</h3>
            <p id="target-display">0 / 0</p>
          </div>

          <div class="panel-box next-box">
            <h3>NEXT</h3>
            <canvas id="next-canvas" width="120" height="120"></canvas>
          </div>
          <div class="panel-box score-box">
            <h3>SCORE</h3>
            <p id="score-display">0</p>
          </div>
          <div class="panel-box level-box">
            <h3>LEVEL</h3>
            <p id="level-display">1</p>
          </div>
          <div class="panel-box lines-box">
            <h3>LINES</h3>
            <p id="lines-display">0</p>
          </div>
          <div class="panel-box audio-box">
            <h3>BGM</h3>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 5px;">
              <label
                style="cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.9em; user-select: none;">
                <input type="checkbox" id="bgm-toggle" checked> ON
              </label>
              <input type="range" id="bgm-volume" min="0" max="1" step="0.1" value="0.5"
                style="flex: 1; cursor: pointer;">
            </div>
          </div>
          <div class="panel-box controls-box">
            <h3>CONTROLS</h3>
            <ul id="controls-list">
              <li>← → 移動</li>
              <li>↑ 右回転</li>
              <li>Z 左回転</li>
              <li>↓ ソフトドロップ</li>
              <li>Space ハードドロップ</li>
              <li>C ホールド</li>
              <li>Esc ポーズ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="game.js"></script>
</body>

</html>
```

## style.css
```css
/* ============================================
   テトリス - スタイルシート (v4)
   ============================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #0a0a0f;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(120, 40, 200, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0, 180, 255, 0.06) 0%, transparent 50%);
}

.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.screen.hidden {
  display: none;
}

/* --- Title --- */
.game-title {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 12px;
  background: linear-gradient(135deg, #00e5ff, #d500f9, #ff1744);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.3));
}

.title-large {
  font-size: 3.6rem;
  margin-bottom: 48px;
  letter-spacing: 18px;
}

/* --- Mode Select --- */
.mode-buttons {
  display: flex;
  gap: 24px;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  cursor: pointer;
  color: #e0e0e0;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.mode-btn:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: 0 8px 30px rgba(0, 229, 255, 0.15);
}

.mode-btn:active {
  transform: translateY(-1px);
}

.mode-icon {
  font-size: 2.4rem;
  line-height: 1;
}

.mode-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 3px;
}

.mode-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* --- Challenge Select --- */
.challenge-subtitle {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
  margin-bottom: 32px;
}

.challenge-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
}

.challenge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  color: #e0e0e0;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  min-width: 100px;
}

.challenge-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 234, 0, 0.5);
  box-shadow: 0 6px 25px rgba(255, 234, 0, 0.1);
}

.challenge-card .card-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffea00, #ff9100);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.challenge-card .card-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 2px;
}

.back-btn {
  margin-top: 28px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.back-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

/* --- Reward Screen --- */
#reward-screen {
  position: relative;
}

#reward-canvas {
  display: block;
  border-radius: 12px;
  background: #0a0a0f;
}

.reward-text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 2;
}

.reward-text-overlay h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 6px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffea00, #ff9100, #ff1744);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 234, 0, 0.5));
}

.reward-text-overlay p {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
}

.reward-skip-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 3;
  transition: color 0.2s;
}

.reward-skip-btn:hover {
  color: #fff;
}

/* --- Layout --- */
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* --- Board --- */
.board-area {
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.1), 0 0 60px rgba(213, 0, 249, 0.05), inset 0 0 30px rgba(0, 0, 0, 0.5);
}

#board {
  display: block;
  background: #111118;
}

/* --- Overlay --- */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.overlay.hidden {
  display: none;
}

.overlay-content {
  text-align: center;
}

.overlay-content h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 6px;
  color: #ff1744;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.6);
}

.overlay-content h2.clear-title {
  color: #76ff03;
  text-shadow: 0 0 20px rgba(118, 255, 3, 0.6);
}

.overlay-content p {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  color: #aaa;
  margin-bottom: 28px;
}

#retry-btn,
.menu-btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 4px;
  padding: 14px 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, #6200ea, #00bcd4);
  box-shadow: 0 0 20px rgba(98, 0, 234, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  margin-left: 12px;
  font-size: 0.8rem;
  padding: 14px 24px;
}

#retry-btn:hover,
.menu-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(98, 0, 234, 0.6);
}

#retry-btn:active,
.menu-btn:active {
  transform: scale(0.97);
}

/* --- Side Panels --- */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 160px;
}

.side-panel-left {
  align-items: flex-end;
}

.panel-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.panel-box h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 12px;
  text-transform: uppercase;
}

.mt8 {
  margin-top: 12px;
}

.hold-box,
.next-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#hold-canvas,
#next-canvas {
  display: block;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

.hold-box.locked h3 {
  color: rgba(255, 255, 255, 0.15);
}

.score-box p,
.lines-box p {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #00e5ff;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

.level-box p {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #d500f9;
  text-shadow: 0 0 10px rgba(213, 0, 249, 0.4);
}

.challenge-box p {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  color: #ffea00;
  text-shadow: 0 0 10px rgba(255, 234, 0, 0.4);
}

.challenge-box.hidden {
  display: none;
}

.controls-box ul {
  list-style: none;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
}

#pause-overlay h2 {
  color: #00e5ff;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
}

.pause-hint {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

/* --- Sub Buttons (KEY CONFIG / DEBUG) --- */
.sub-btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #aaa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
}

.sub-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: #00e5ff;
}

/* --- Key Config --- */
.keyconfig-list {
  width: 340px;
  max-width: 90vw;
}

.keyconfig-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.kc-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  color: #ccc;
  letter-spacing: 1px;
}

.kc-btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  padding: 6px 18px;
  min-width: 80px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid #00e5ff;
  color: #00e5ff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.kc-btn:hover {
  background: rgba(0, 229, 255, 0.25);
}

.kc-btn.waiting {
  background: rgba(255, 200, 0, 0.2);
  border-color: #ffc400;
  color: #ffc400;
  animation: pulse-waiting 0.8s infinite alternate;
}

@keyframes pulse-waiting {
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
}

/* --- Debug Panel --- */
.debug-panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px 25px;
  margin-bottom: 15px;
  font-family: 'Orbitron', sans-serif;
}

.debug-panel h3 {
  font-size: 0.85rem;
  color: #00e5ff;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

/* --- Challenge Grid (10 cards) --- */
.challenge-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  max-width: 550px;
  margin: 0 auto 20px;
}

.challenge-card {
  padding: 12px 8px;
  min-width: 90px;
}

.card-label {
  font-size: 0.6rem;
}
```

## game.js
```javascript
/* ============================================
   テトリス - ゲームロジック (v5)
   BGM / ハードドロップ / T-spin / チャレンジ1-5
   ============================================ */

(() => {
  'use strict';

  // =============================================
  // 定数
  // =============================================
  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;
  const BASE_DROP_INTERVAL = 1000; // レベル1の開始速度を遅く(1000msに)
  const SOFT_DROP_INTERVAL = 50;
  const LINES_PER_LEVEL = 10;
  const LOCK_DELAY = 500; // 接地後の固定猶予 (ms)

  const COLORS = {
    I: '#00e5ff', J: '#2979ff', L: '#ff9100', O: '#ffea00',
    S: '#76ff03', T: '#d500f9', Z: '#ff1744',
  };

  const SHAPES = {
    I: [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]],
    J: [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]], [[0, 1, 0], [0, 1, 0], [1, 1, 0]]],
    L: [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]],
    O: [[[1, 1], [1, 1]], [[1, 1], [1, 1]], [[1, 1], [1, 1]], [[1, 1], [1, 1]]],
    S: [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]]],
    T: [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]],
    Z: [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]],
  };

  const WALL_KICK_JLSTZ = {
    '0>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], '1>0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '1>2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], '2>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '2>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], '3>2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '3>0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], '0>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  };
  const WALL_KICK_I = {
    '0>1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], '1>0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '1>2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]], '2>1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '2>3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], '3>2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '3>0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], '0>3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  };

  const LINE_SCORES = [0, 100, 300, 500, 800];
  const TSPIN_SCORES = [400, 800, 1200, 1600]; // T-spin 0,1,2,3ライン
  const HARD_DROP_SCORE_PER_ROW = 2;
  const PIECE_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  // =============================================
  // チャレンジ1-10 難易度テーブル
  // 各チャレンジは5ステージ
  // speedMod: 落下速度の倍率 (低いほど速い)
  // startLevel: 開始レベル
  // =============================================
  const CHALLENGE_DEFS = [
    {
      name: 'BEGINNER', color: '#76ff03', speedMod: 1.0, startLevel: 1,
      stages: [
        { height: 3, maxGaps: 3, target: 3 },
        { height: 4, maxGaps: 3, target: 4 },
        { height: 4, maxGaps: 2, target: 5 },
        { height: 5, maxGaps: 2, target: 5 },
        { height: 5, maxGaps: 2, target: 6 },
      ],
    },
    {
      name: 'EASY', color: '#69f0ae', speedMod: 0.95, startLevel: 2,
      stages: [
        { height: 4, maxGaps: 3, target: 4 },
        { height: 5, maxGaps: 2, target: 5 },
        { height: 5, maxGaps: 2, target: 6 },
        { height: 6, maxGaps: 2, target: 7 },
        { height: 6, maxGaps: 2, target: 8 },
      ],
    },
    {
      name: 'NORMAL', color: '#00e5ff', speedMod: 0.85, startLevel: 3,
      stages: [
        { height: 5, maxGaps: 3, target: 5 },
        { height: 6, maxGaps: 2, target: 6 },
        { height: 6, maxGaps: 2, target: 7 },
        { height: 7, maxGaps: 2, target: 8 },
        { height: 7, maxGaps: 2, target: 9 },
      ],
    },
    {
      name: 'MODERATE', color: '#40c4ff', speedMod: 0.75, startLevel: 4,
      stages: [
        { height: 6, maxGaps: 2, target: 6 },
        { height: 7, maxGaps: 2, target: 7 },
        { height: 7, maxGaps: 2, target: 8 },
        { height: 8, maxGaps: 2, target: 9 },
        { height: 8, maxGaps: 1, target: 10 },
      ],
    },
    {
      name: 'HARD', color: '#ffea00', speedMod: 0.65, startLevel: 5,
      stages: [
        { height: 7, maxGaps: 2, target: 7 },
        { height: 7, maxGaps: 2, target: 8 },
        { height: 8, maxGaps: 1, target: 9 },
        { height: 9, maxGaps: 1, target: 10 },
        { height: 9, maxGaps: 1, target: 11 },
      ],
    },
    {
      name: 'VERY HARD', color: '#ffc400', speedMod: 0.55, startLevel: 7,
      stages: [
        { height: 8, maxGaps: 2, target: 8 },
        { height: 8, maxGaps: 1, target: 9 },
        { height: 9, maxGaps: 1, target: 10 },
        { height: 10, maxGaps: 1, target: 12 },
        { height: 10, maxGaps: 1, target: 13 },
      ],
    },
    {
      name: 'EXPERT', color: '#ff9100', speedMod: 0.45, startLevel: 9,
      stages: [
        { height: 9, maxGaps: 2, target: 9 },
        { height: 9, maxGaps: 1, target: 10 },
        { height: 10, maxGaps: 1, target: 12 },
        { height: 11, maxGaps: 1, target: 14 },
        { height: 11, maxGaps: 1, target: 15 },
      ],
    },
    {
      name: 'MASTER', color: '#ff5722', speedMod: 0.38, startLevel: 11,
      stages: [
        { height: 10, maxGaps: 1, target: 10 },
        { height: 10, maxGaps: 1, target: 12 },
        { height: 11, maxGaps: 1, target: 14 },
        { height: 12, maxGaps: 1, target: 16 },
        { height: 12, maxGaps: 1, target: 18 },
      ],
    },
    {
      name: 'EXTREME', color: '#e91e63', speedMod: 0.30, startLevel: 14,
      stages: [
        { height: 11, maxGaps: 1, target: 12 },
        { height: 11, maxGaps: 1, target: 14 },
        { height: 12, maxGaps: 1, target: 16 },
        { height: 13, maxGaps: 1, target: 18 },
        { height: 13, maxGaps: 1, target: 20 },
      ],
    },
    {
      name: 'LEGEND', color: '#ff1744', speedMod: 0.25, startLevel: 17,
      stages: [
        { height: 12, maxGaps: 1, target: 14 },
        { height: 12, maxGaps: 1, target: 16 },
        { height: 13, maxGaps: 1, target: 18 },
        { height: 14, maxGaps: 1, target: 22 },
        { height: 14, maxGaps: 1, target: 25 },
      ],
    },
  ];

  // =============================================
  // キーバインド設定
  // =============================================
  const DEFAULT_KEYS = {
    moveLeft: 'ArrowLeft', moveRight: 'ArrowRight',
    rotateRight: 'ArrowUp', rotateLeft: 'z',
    softDrop: 'ArrowDown', hardDrop: ' ',
    hold: 'c', pause: 'Escape',
  };
  const KEY_LABELS = {
    moveLeft: '← 移動', moveRight: '→ 移動',
    rotateRight: '右回転', rotateLeft: '左回転',
    softDrop: 'ソフトドロップ', hardDrop: 'ハードドロップ',
    hold: 'ホールド', pause: 'ポーズ',
  };
  let keyBindings = { ...DEFAULT_KEYS };
  function loadKeyBindings() {
    try {
      const saved = localStorage.getItem('tetris_keys');
      if (saved) Object.assign(keyBindings, JSON.parse(saved));
    } catch (e) { /* ignore */ }
  }
  function saveKeyBindings() {
    try { localStorage.setItem('tetris_keys', JSON.stringify(keyBindings)); } catch (e) { /* ignore */ }
  }
  loadKeyBindings();

  function keyDisplayName(key) {
    if (key === ' ') return 'Space';
    if (key === 'ArrowLeft') return '←';
    if (key === 'ArrowRight') return '→';
    if (key === 'ArrowUp') return '↑';
    if (key === 'ArrowDown') return '↓';
    if (key === 'Escape') return 'Esc';
    return key.toUpperCase();
  }

  // =============================================
  // サウンドシステム
  // =============================================
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  function playTone(freq, duration, type = 'square', volume = 0.08) {
    ensureAudio();
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  }
  function playNoise(duration, volume = 0.05) {
    ensureAudio();
    const sz = audioCtx.sampleRate * duration;
    const buf = audioCtx.createBuffer(1, sz, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(volume, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    src.connect(g); g.connect(audioCtx.destination); src.start();
  }
  const SFX = {
    move() { playTone(200, 0.06, 'square', 0.04); },
    rotate() { playTone(300, 0.08, 'square', 0.05); },
    lock() { playTone(150, 0.12, 'triangle', 0.06); playNoise(0.06, 0.03); },
    hardDrop() { playTone(120, 0.15, 'triangle', 0.08); playNoise(0.08, 0.04); },
    hold() { playTone(400, 0.08, 'sine', 0.05); },
    clear() { playTone(523, 0.1, 'square', 0.06); playTone(659, 0.1, 'square', 0.06); },
    tspin() { [392, 523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'sine', 0.07), i * 50)); },
    tetris() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'square', 0.08), i * 60)); },
    levelUp() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'sine', 0.07), i * 80)); },
    gameOver() { [400, 350, 300, 200].forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sawtooth', 0.06), i * 150)); },
    stageClear() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.08), i * 100)); },
    rewardChime() {
      const notes = [523, 659, 784, 880, 1047, 1175, 1319, 1397, 1568];
      notes.forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.06), i * 200));
    },
  };

  // =============================================
  // BGMシステム - コロベイニキ (Korobeiniki) 8bit
  // =============================================
  let bgmPlaying = false, bgmTimers = [], bgmLoopId = null;
  let bgmEnabled = true;
  let bgmVolume = 0.5;

  const BGM_BPM = 150;
  const BGM_BEAT = 60 / BGM_BPM;

  // コロベイニキ 歌バージョン メロディ [freq, dur_beats, start_beat]
  // Aメロ (8拍) + Bメロ (8拍) + A'メロ (8拍) + B'メロ (8拍) = 32拍
  const BGM_MELODY = [
    // Aメロ: E-B-C-D-C-B-A-A-C-E-D-C-B-B-C-D-E-C-A-A
    [659, 1, 0], [494, 0.5, 1], [523, 0.5, 1.5], [587, 1, 2], [523, 0.5, 3], [494, 0.5, 3.5],
    [440, 1, 4], [440, 0.5, 5], [523, 0.5, 5.5], [659, 1, 6], [587, 0.5, 7], [523, 0.5, 7.5],
    // Bメロ
    [494, 1.5, 8], [523, 0.5, 9.5], [587, 1, 10], [659, 1, 11],
    [523, 1, 12], [440, 1, 13], [440, 1, 14], [0, 1, 15],
    // A'メロ (繰り返し変化)
    [587, 1, 16], [0, 0.5, 17], [698, 0.5, 17.5], [880, 1, 18], [784, 0.5, 19], [698, 0.5, 19.5],
    [659, 1.5, 20], [523, 0.5, 21.5], [659, 1, 22], [587, 0.5, 23], [523, 0.5, 23.5],
    // B'メロ
    [494, 1.5, 24], [523, 0.5, 25.5], [587, 1, 26], [659, 1, 27],
    [523, 1, 28], [440, 1, 29], [440, 1, 30], [0, 1, 31],
  ];

  // ベースライン (Am-E-Am-E パターン, Dm-Am-E-Am)
  const BGM_BASS = [
    [220, 1, 0], [220, 1, 1], [165, 1, 2], [165, 1, 3],
    [220, 1, 4], [220, 1, 5], [165, 1, 6], [165, 1, 7],
    [165, 1, 8], [165, 1, 9], [147, 1, 10], [147, 1, 11],
    [220, 1, 12], [165, 1, 13], [220, 1, 14], [0, 1, 15],
    [147, 1, 16], [147, 1, 17], [175, 1, 18], [175, 1, 19],
    [220, 1, 20], [220, 1, 21], [165, 1, 22], [165, 1, 23],
    [165, 1, 24], [165, 1, 25], [147, 1, 26], [147, 1, 27],
    [220, 1, 28], [165, 1, 29], [220, 1, 30], [0, 1, 31],
  ];

  function startBGM() {
    if (bgmPlaying || !bgmEnabled) return;
    bgmPlaying = true;
    scheduleBGMLoop();
  }
  function stopBGM() {
    bgmPlaying = false;
    for (const t of bgmTimers) clearTimeout(t);
    bgmTimers = [];
    if (bgmLoopId) { clearTimeout(bgmLoopId); bgmLoopId = null; }
  }
  function scheduleBGMLoop() {
    if (!bgmPlaying) return;
    const loopLen = 32 * BGM_BEAT * 1000;
    // メロディ
    for (const [freq, dur, beat] of BGM_MELODY) {
      if (freq === 0) continue;
      bgmTimers.push(setTimeout(() => {
        if (bgmPlaying && bgmEnabled) playTone(freq, dur * BGM_BEAT * 0.9, 'square', 0.035 * bgmVolume);
      }, beat * BGM_BEAT * 1000));
    }
    // ベース
    for (const [freq, dur, beat] of BGM_BASS) {
      if (freq === 0) continue;
      bgmTimers.push(setTimeout(() => {
        if (bgmPlaying && bgmEnabled) playTone(freq, dur * BGM_BEAT * 0.8, 'triangle', 0.03 * bgmVolume);
      }, beat * BGM_BEAT * 1000));
    }
    // ドラムパターン (8分音符キック)
    for (let b = 0; b < 32; b++) {
      bgmTimers.push(setTimeout(() => {
        if (bgmPlaying && bgmEnabled) {
          playNoise(0.03, (b % 4 === 0 ? 0.04 : 0.02) * bgmVolume);
        }
      }, b * BGM_BEAT * 1000));
    }
    // ループ
    bgmLoopId = setTimeout(() => {
      bgmTimers = [];
      scheduleBGMLoop();
    }, loopLen);
  }

  // =============================================
  // DOM要素
  // =============================================
  const modeSelectScreen = document.getElementById('mode-select-screen');
  const challengeSelectScreen = document.getElementById('challenge-select-screen');
  const rewardScreen = document.getElementById('reward-screen');
  const gameScreen = document.getElementById('game-screen');
  const btnEndless = document.getElementById('btn-endless');
  const btnChallengeSelect = document.getElementById('btn-challenge-select');
  const btnBackMenu = document.getElementById('btn-back-menu');
  const challengeGridEl = document.getElementById('challenge-grid');
  const rewardCanvas = document.getElementById('reward-canvas');
  const rewardCtx = rewardCanvas.getContext('2d');
  const rewardTitle = document.getElementById('reward-title');
  const rewardSub = document.getElementById('reward-sub');
  const btnRewardSkip = document.getElementById('btn-reward-skip');

  const boardCanvas = document.getElementById('board');
  const boardCtx = boardCanvas.getContext('2d');
  const nextCanvas = document.getElementById('next-canvas');
  const nextCtx = nextCanvas.getContext('2d');
  const holdCanvas = document.getElementById('hold-canvas');
  const holdCtx = holdCanvas.getContext('2d');
  const scoreDisplay = document.getElementById('score-display');
  const linesDisplay = document.getElementById('lines-display');
  const levelDisplay = document.getElementById('level-display');
  const gameOverOverlay = document.getElementById('game-over-overlay');
  const resultTitle = document.getElementById('result-title');
  const finalScoreText = document.getElementById('final-score-text');
  const retryBtn = document.getElementById('retry-btn');
  const menuBtn = document.getElementById('menu-btn');
  const holdBox = document.querySelector('.hold-box');
  const pauseOverlay = document.getElementById('pause-overlay');
  const challengeInfo = document.getElementById('challenge-info');
  const challengeModeLabel = document.getElementById('challenge-mode-label');
  const stageDisplay = document.getElementById('stage-display');
  const targetDisplay = document.getElementById('target-display');
  const bgmToggleEl = document.getElementById('bgm-toggle');
  const bgmVolumeEl = document.getElementById('bgm-volume');
  const startLevelInput = document.getElementById('start-level');

  const bgImage = new Image(); bgImage.src = 'assets/bg.png';

  // =============================================
  // ゲーム状態
  // =============================================
  let gameMode = 'endless';
  let challengeIndex = 0;   // 0-9 (チャレンジ1-10)
  let board = [];
  let current = null, next = null;
  let holdType = null, holdLocked = false;
  let score = 0, lines = 0, level = 1;
  let gameOver = false, paused = false;
  let dropTimer = null, dropInterval = BASE_DROP_INTERVAL, softDropping = false;
  let lockTimer = null;
  let challengeStage = 1, challengeTarget = 0, challengeCleared = 0;
  let lineClearEffects = [], particles = [], animationId = null;
  let bag = [];
  let lastAction = ''; // 'rotate' | 'move' | '' - T-spin判定用
  let actionText = null; // { text, time } - 画面表示用

  // =============================================
  // テトリミノ生成
  // =============================================
  function shuffleBag() {
    bag = [...PIECE_TYPES];
    for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[bag[i], bag[j]] = [bag[j], bag[i]]; }
  }
  function getNextType() { if (bag.length === 0) shuffleBag(); return bag.pop(); }
  function createPiece(type) {
    const shape = SHAPES[type][0];
    return { type, rotation: 0, shape, x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
  }

  // =============================================
  // レベルシステム
  // =============================================
  function getSpeedMod() {
    if (gameMode === 'challenge') return CHALLENGE_DEFS[challengeIndex].speedMod;
    return 1.0;
  }
  function getLevelDropInterval() {
    const base = BASE_DROP_INTERVAL * Math.pow(0.85, level - 1) * getSpeedMod();
    return Math.max(base, 50);
  }
  function checkLevelUp() {
    const nl = Math.floor(lines / LINES_PER_LEVEL) + 1;
    if (nl > level) { level = nl; SFX.levelUp(); if (!softDropping) { dropInterval = getLevelDropInterval(); startDropTimer(); } }
  }

  // =============================================
  // 盤面操作
  // =============================================
  function createBoard() { const b = []; for (let r = 0; r < ROWS; r++) b.push(new Array(COLS).fill(0)); return b; }
  function isValidPosition(shape, ox, oy) {
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue; const nx = ox + c, ny = oy + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false; if (ny < 0) continue; if (board[ny][nx]) return false;
    } return true;
  }
  // T-spin判定: T型の4つの角のうち3つ以上が埋まっていればT-spin
  function checkTSpin() {
    if (current.type !== 'T' || lastAction !== 'rotate') return false;
    const cx = current.x, cy = current.y;
    // T型は3x3。4つの角の座標
    const corners = [[cx, cy], [cx + 2, cy], [cx, cy + 2], [cx + 2, cy + 2]];
    let filled = 0;
    for (const [x, y] of corners) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS || (y >= 0 && x >= 0 && x < COLS && y < ROWS && board[y][x])) filled++;
    }
    return filled >= 3;
  }

  function showActionText(text) {
    actionText = { text, time: performance.now() };
  }

  function lockPiece() {
    const isTSpin = checkTSpin();
    const { shape, x, y, type } = current;
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue; const by = y + r, bx = x + c;
      if (by < 0) { triggerGameOver(); return; } board[by][bx] = type;
    }
    SFX.lock(); clearLines(isTSpin);
    if (gameOver) return;
    holdLocked = false; lastAction = ''; spawnPiece();
  }

  function clearLines(isTSpin) {
    const cr = [];
    for (let r = ROWS - 1; r >= 0; r--) if (board[r].every(c => c !== 0)) cr.push(r);

    if (isTSpin) {
      SFX.tspin();
      const bonus = (TSPIN_SCORES[cr.length] || TSPIN_SCORES[0]) * level;
      score += bonus;
      const labels = ['T-SPIN', 'T-SPIN SINGLE', 'T-SPIN DOUBLE', 'T-SPIN TRIPLE'];
      showActionText(labels[cr.length] || 'T-SPIN');
    }

    if (cr.length > 0) {
      const tet = cr.length === 4;
      if (!isTSpin) { if (tet) SFX.tetris(); else SFX.clear(); }
      if (tet) showActionText('TETRIS!');
      spawnLineClearEffect(cr, tet || isTSpin);
      cr.sort((a, b) => b - a);
      for (const row of cr) board.splice(row, 1);
      for (let i = 0; i < cr.length; i++) board.unshift(new Array(COLS).fill(0));
      score += (LINE_SCORES[cr.length] || 0) * level; lines += cr.length;
      if (gameMode === 'challenge') { challengeCleared += cr.length; if (challengeCleared >= challengeTarget) { triggerStageClear(); return; } }
      checkLevelUp(); updateUI();
    }
  }
  function spawnPiece() {
    current = createPiece(next.type); next = createPiece(getNextType());
    if (!isValidPosition(current.shape, current.x, current.y)) triggerGameOver();
  }

  // =============================================
  // ホールド / 移動 / 回転
  // =============================================
  function holdPiece() {
    if (gameOver || holdLocked) return; holdLocked = true; SFX.hold();
    const ct = current.type;
    if (holdType === null) { holdType = ct; current = createPiece(next.type); next = createPiece(getNextType()); }
    else { const sw = holdType; holdType = ct; current = createPiece(sw); }
    if (!isValidPosition(current.shape, current.x, current.y)) triggerGameOver();
    lastAction = ''; draw();
  }
  function movePiece(dx, dy) {
    if (gameOver) return false;
    if (isValidPosition(current.shape, current.x + dx, current.y + dy)) {
      current.x += dx; current.y += dy;
      lastAction = 'move';
      resetLockTimer();
      return true;
    } return false;
  }
  function rotatePiece(dir) {
    if (gameOver) return; const { type, rotation } = current; if (type === 'O') return;
    const nr = (rotation + dir + 4) % 4, ns = SHAPES[type][nr], kk = `${rotation}>${nr}`;
    const kicks = type === 'I' ? WALL_KICK_I[kk] : WALL_KICK_JLSTZ[kk]; if (!kicks) return;
    for (const [dx, dy] of kicks) if (isValidPosition(ns, current.x + dx, current.y - dy)) {
      current.shape = ns; current.rotation = nr; current.x += dx; current.y -= dy;
      lastAction = 'rotate';
      resetLockTimer();
      SFX.rotate(); return;
    }
  }

  // ハードドロップ
  function hardDrop() {
    if (gameOver || !current) return;
    let rows = 0;
    while (isValidPosition(current.shape, current.x, current.y + 1)) { current.y++; rows++; }
    score += rows * HARD_DROP_SCORE_PER_ROW;
    cancelLockTimer();
    SFX.hardDrop();
    lockPiece();
    draw();
  }

  // =============================================
  // ドロップタイマー / ロックディレイ
  // =============================================
  function isGrounded() {
    return !isValidPosition(current.shape, current.x, current.y + 1);
  }

  function startLockTimer() {
    if (lockTimer !== null) return; // 既に動作中
    lockTimer = setTimeout(() => {
      lockTimer = null;
      if (current && isGrounded()) {
        lockPiece();
        draw();
      }
    }, LOCK_DELAY);
  }

  function cancelLockTimer() {
    if (lockTimer !== null) { clearTimeout(lockTimer); lockTimer = null; }
  }

  function resetLockTimer() {
    cancelLockTimer();
    if (current && isGrounded()) startLockTimer();
  }

  function startDropTimer() {
    stopDropTimer();
    dropTimer = setInterval(() => {
      if (!movePiece(0, 1)) {
        if (softDropping) {
          // ソフトドロップ中は接地即ロック
          cancelLockTimer();
          lockPiece();
        } else {
          // 通常落下はロックディレイ
          startLockTimer();
        }
      } else {
        cancelLockTimer();
      }
      draw();
    }, dropInterval);
  }

  function stopDropTimer() {
    if (dropTimer !== null) { clearInterval(dropTimer); dropTimer = null; }
    cancelLockTimer();
  }

  // =============================================
  // エフェクト
  // =============================================
  function spawnLineClearEffect(rows, isTetris) {
    const now = performance.now();
    lineClearEffects.push({ rows: [...rows], startTime: now, duration: isTetris ? 700 : 400, isTetris });
    for (const row of rows) {
      const cnt = isTetris ? 30 : 12; for (let i = 0; i < cnt; i++) {
        particles.push({
          x: Math.random() * COLS * CELL + CELL / 2, y: row * CELL + CELL / 2,
          vx: (Math.random() - 0.5) * (isTetris ? 10 : 5), vy: (Math.random() - 0.5) * (isTetris ? 8 : 4) - 2,
          color: isTetris ? `hsl(${Math.random() * 360},100%,65%)` : `hsl(${180 + Math.random() * 60},80%,60%)`,
          life: isTetris ? 60 : 35, maxLife: isTetris ? 60 : 35, size: isTetris ? 3 + Math.random() * 4 : 2 + Math.random() * 3
        });
      }
    }
    if (isTetris) for (let i = 0; i < 40; i++) particles.push({
      x: Math.random() * boardCanvas.width, y: Math.random() * boardCanvas.height,
      vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, color: `hsl(${Math.random() * 360},100%,70%)`, life: 45 + Math.random() * 20, maxLife: 65, size: 2 + Math.random() * 3
    });
  }
  function updateParticles() { for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; if (p.life <= 0) particles.splice(i, 1); } }
  function drawParticles() { for (const p of particles) { boardCtx.globalAlpha = p.life / p.maxLife; boardCtx.fillStyle = p.color; boardCtx.beginPath(); boardCtx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2); boardCtx.fill(); } boardCtx.globalAlpha = 1; }
  function drawLineClearEffects() {
    const now = performance.now();
    for (let i = lineClearEffects.length - 1; i >= 0; i--) {
      const fx = lineClearEffects[i]; const el = now - fx.startTime; const pr = Math.min(el / fx.duration, 1);
      if (pr >= 1) { lineClearEffects.splice(i, 1); continue; }
      const fa = (1 - pr) * (fx.isTetris ? 0.6 : 0.35);
      if (fx.isTetris) { boardCtx.fillStyle = `rgba(255,215,0,${fa * 0.3})`; boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height); }
      for (const row of fx.rows) {
        const y = row * CELL; boardCtx.fillStyle = fx.isTetris ? `rgba(255,230,100,${fa})` : `rgba(255,255,255,${fa})`; boardCtx.fillRect(0, y, COLS * CELL, CELL);
        if (fx.isTetris) { boardCtx.shadowColor = 'rgba(255,200,0,0.8)'; boardCtx.shadowBlur = 30 * (1 - pr); boardCtx.fillStyle = `rgba(255,200,0,${fa * 0.5})`; boardCtx.fillRect(0, y - 5, COLS * CELL, CELL + 10); boardCtx.shadowBlur = 0; }
      }
    }
  }

  // =============================================
  // 描画
  // =============================================
  function drawCell(ctx, x, y, type, cs) { const c = COLORS[type], px = x * cs, py = y * cs; ctx.fillStyle = c; ctx.fillRect(px + 1, py + 1, cs - 2, cs - 2); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(px + 1, py + 1, cs - 2, 3); ctx.fillRect(px + 1, py + 1, 3, cs - 2); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(px + 1, py + cs - 4, cs - 2, 3); ctx.fillRect(px + cs - 4, py + 1, 3, cs - 2); }
  function drawGhostPiece() { if (!current) return; let gy = current.y; while (isValidPosition(current.shape, current.x, gy + 1)) gy++; if (gy === current.y) return; boardCtx.globalAlpha = 0.2; for (let r = 0; r < current.shape.length; r++)for (let c = 0; c < current.shape[r].length; c++)if (current.shape[r][c]) drawCell(boardCtx, current.x + c, gy + r, current.type, CELL); boardCtx.globalAlpha = 1; }
  function drawBoard() {
    boardCtx.fillStyle = '#111118'; boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
    boardCtx.strokeStyle = 'rgba(255,255,255,0.04)'; boardCtx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) { boardCtx.beginPath(); boardCtx.moveTo(0, r * CELL); boardCtx.lineTo(COLS * CELL, r * CELL); boardCtx.stroke(); }
    for (let c = 0; c <= COLS; c++) { boardCtx.beginPath(); boardCtx.moveTo(c * CELL, 0); boardCtx.lineTo(c * CELL, ROWS * CELL); boardCtx.stroke(); }
    for (let r = 0; r < ROWS; r++)for (let c = 0; c < COLS; c++)if (board[r][c]) drawCell(boardCtx, c, r, board[r][c], CELL);
  }
  function drawCurrentPiece() { if (!current) return; const { shape, type, x, y } = current; for (let r = 0; r < shape.length; r++)for (let c = 0; c < shape[r].length; c++)if (shape[r][c]) drawCell(boardCtx, x + c, y + r, type, CELL); }
  function drawPreviewPiece(ctx, cvs, piece) { const cs = 25; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, cvs.width, cvs.height); if (!piece) return; const s = SHAPES[piece][0], rs = s.length, cl = s[0].length, ox = (cvs.width / cs - cl) / 2, oy = (cvs.height / cs - rs) / 2; for (let r = 0; r < rs; r++)for (let c = 0; c < cl; c++)if (s[r][c]) drawCell(ctx, ox + c, oy + r, piece, cs); }
  function drawHold() { if (holdLocked) holdCtx.globalAlpha = 0.4; drawPreviewPiece(holdCtx, holdCanvas, holdType); holdCtx.globalAlpha = 1; holdLocked ? holdBox.classList.add('locked') : holdBox.classList.remove('locked'); }
  function drawNext() { drawPreviewPiece(nextCtx, nextCanvas, next ? next.type : null); }
  function drawActionText() {
    if (!actionText) return;
    const elapsed = performance.now() - actionText.time;
    if (elapsed > 1500) { actionText = null; return; }
    const alpha = Math.max(0, 1 - elapsed / 1500);
    const yOff = -elapsed * 0.03;
    boardCtx.save();
    boardCtx.globalAlpha = alpha;
    boardCtx.font = 'bold 22px Orbitron, sans-serif';
    boardCtx.textAlign = 'center';
    boardCtx.fillStyle = '#fff';
    boardCtx.shadowColor = actionText.text.includes('T-SPIN') ? '#d500f9' : '#ffea00';
    boardCtx.shadowBlur = 15;
    boardCtx.fillText(actionText.text, boardCanvas.width / 2, boardCanvas.height / 2 + yOff);
    boardCtx.restore();
  }
  function draw() { drawBoard(); drawGhostPiece(); drawCurrentPiece(); drawLineClearEffects(); drawParticles(); drawActionText(); drawNext(); drawHold(); }
  function updateUI() {
    scoreDisplay.textContent = score; linesDisplay.textContent = lines; levelDisplay.textContent = level;
    if (gameMode === 'challenge') { stageDisplay.textContent = challengeStage; targetDisplay.textContent = `${challengeCleared} / ${challengeTarget}`; }
  }
  function animationLoop() {
    if (lineClearEffects.length > 0 || particles.length > 0 || actionText) { updateParticles(); draw(); }
    animationId = requestAnimationFrame(animationLoop);
  }

  // =============================================
  // チャレンジモード: ステージ生成
  // =============================================
  function getChallengeDef() { return CHALLENGE_DEFS[challengeIndex]; }
  function getStageConfig() {
    const def = getChallengeDef();
    return def.stages[Math.min(challengeStage - 1, def.stages.length - 1)];
  }
  function generateChallengeBoard() {
    const b = createBoard(), cfg = getStageConfig();
    const types = PIECE_TYPES.filter(t => t !== 'O');
    const h = Math.min(cfg.height, ROWS - 4); // 最低4行は空ける
    for (let r = ROWS - h; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) b[r][c] = types[Math.floor(Math.random() * types.length)];
      const gc = 1 + Math.floor(Math.random() * cfg.maxGaps), pos = [];
      while (pos.length < gc) { const p = Math.floor(Math.random() * COLS); if (!pos.includes(p)) pos.push(p); }
      for (const p of pos) b[r][p] = 0;
    }
    return b;
  }

  // =============================================
  // ゲームオーバー / ステージクリア
  // =============================================
  function triggerGameOver() {
    gameOver = true; stopDropTimer(); stopBGM(); SFX.gameOver();
    resultTitle.textContent = 'GAME OVER'; resultTitle.classList.remove('clear-title');
    finalScoreText.textContent = `Score: ${score}`; gameOverOverlay.classList.remove('hidden');
  }
  function triggerStageClear() {
    gameOver = true; stopDropTimer(); stopBGM(); SFX.stageClear();
    const def = getChallengeDef(), maxStage = def.stages.length;
    if (challengeStage >= maxStage) {
      // チャレンジ全クリア → ご褒美アニメーション
      resultTitle.textContent = `CHALLENGE ${challengeIndex + 1} CLEAR!`;
      retryBtn.textContent = 'CONTINUE';
    } else {
      resultTitle.textContent = `STAGE ${challengeStage} CLEAR!`;
      retryBtn.textContent = 'NEXT STAGE';
    }
    resultTitle.classList.add('clear-title');
    finalScoreText.textContent = `Score: ${score}`;
    gameOverOverlay.classList.remove('hidden');
  }

  // =============================================
  // ご褒美アニメーション (15秒)
  // =============================================
  const REWARD_DURATION = 15000;
  let rewardAnimId = null, rewardStartTime = 0;
  let rewardParticles = [], rewardFireworks = [];

  function startRewardAnimation(chIdx) {
    // 全画面をリワード画面に
    hideAllScreens();
    rewardScreen.classList.remove('hidden');
    const def = CHALLENGE_DEFS[chIdx];
    rewardTitle.textContent = `CHALLENGE ${chIdx + 1}`;
    rewardSub.textContent = `「${def.name}」 COMPLETE!`;

    rewardParticles = [];
    rewardFireworks = [];
    rewardStartTime = performance.now();

    const dancerCount = (chIdx + 1) * 2; // レベルに応じて人数増加 (2〜20人)
    const dancers = [];
    for (let i = 0; i < dancerCount; i++) {
      dancers.push({
        x: 60 + Math.random() * (rewardCanvas.width - 120),
        y: 460 + Math.random() * 90,
        size: 0.35 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 0.8
      });
    }
    // 手前の人を後から描画するためY座標でソート
    dancers.sort((a, b) => a.y - b.y);

    SFX.rewardChime();
    // 定期的にサウンド
    const soundTimer = setInterval(() => {
      if (performance.now() - rewardStartTime > REWARD_DURATION - 2000) { clearInterval(soundTimer); return; }
      playTone(440 + Math.random() * 800, 0.15, 'sine', 0.04);
    }, 800);

    function rewardLoop() {
      const now = performance.now();
      const elapsed = now - rewardStartTime;
      if (elapsed >= REWARD_DURATION) {
        cancelAnimationFrame(rewardAnimId);
        rewardAnimId = null;
        clearInterval(soundTimer);
        finishReward();
        return;
      }
      const progress = elapsed / REWARD_DURATION;

      // Canvas描画
      const W = rewardCanvas.width, H = rewardCanvas.height;
      if (bgImage.complete) {
        rewardCtx.drawImage(bgImage, 0, 0, W, H);
        rewardCtx.fillStyle = `rgba(0,0,0,0.4)`; // 背景を少し暗く
        rewardCtx.fillRect(0, 0, W, H);
      } else {
        rewardCtx.fillStyle = `rgba(10,10,15,0.15)`;
        rewardCtx.fillRect(0, 0, W, H);
      }

      // コサックダンス描画 (プロシージャル)
      for (const d of dancers) {
        const beat = elapsed * 0.005 * d.speed + d.phase;
        const flip = Math.floor(beat) % 2 === 0 ? 1 : -1;
        const bounce = Math.abs(Math.sin(beat * Math.PI)) * 12 * d.size;
        const kickLeg = Math.sin(beat * Math.PI * 2);

        rewardCtx.save();
        rewardCtx.translate(d.x, d.y - bounce);
        rewardCtx.scale(flip * d.size, d.size);
        drawCossackDancer(rewardCtx, 0, 0, kickLeg);
        rewardCtx.restore();
      }

      // 花火を定期的に生成
      if (Math.random() < 0.08 + chIdx * 0.02) {
        spawnFirework(W, H, chIdx);
      }

      // 花火の更新・描画
      updateAndDrawFireworks(W, H, progress, chIdx);

      // 流れ星エフェクト
      if (Math.random() < 0.05) {
        rewardParticles.push({
          x: Math.random() * W, y: 0, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
          color: `hsl(${Math.random() * 360},100%,70%)`, life: 80 + Math.random() * 40, maxLife: 120,
          size: 1 + Math.random() * 2, trail: [],
        });
      }
      for (let i = rewardParticles.length - 1; i >= 0; i--) {
        const p = rewardParticles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 10) p.trail.shift();
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0 || p.y > H) { rewardParticles.splice(i, 1); continue; }
        const a = p.life / p.maxLife;
        // 軌跡
        for (let t = 0; t < p.trail.length; t++) {
          const ta = (t / p.trail.length) * a * 0.3;
          rewardCtx.fillStyle = p.color; rewardCtx.globalAlpha = ta;
          rewardCtx.beginPath(); rewardCtx.arc(p.trail[t].x, p.trail[t].y, p.size * 0.5, 0, Math.PI * 2); rewardCtx.fill();
        }
        rewardCtx.globalAlpha = a; rewardCtx.fillStyle = p.color;
        rewardCtx.beginPath(); rewardCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); rewardCtx.fill();
      }
      rewardCtx.globalAlpha = 1;

      // テキストのパルス効果
      const pulse = 0.8 + 0.2 * Math.sin(elapsed * 0.003);
      rewardTitle.style.opacity = pulse;

      rewardAnimId = requestAnimationFrame(rewardLoop);
    }
    rewardLoop();
  }

  function spawnFirework(W, H, chIdx) {
    const cx = 50 + Math.random() * (W - 100);
    const cy = 50 + Math.random() * (H * 0.6);
    const hue = Math.random() * 360;
    const count = 30 + chIdx * 15;
    const fw = { particles: [], born: performance.now() };
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      fw.particles.push({
        x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: `hsl(${hue + Math.random() * 60},100%,${60 + Math.random() * 20}%)`,
        life: 40 + Math.random() * 30, maxLife: 70, size: 1.5 + Math.random() * 2,
      });
    }
    rewardFireworks.push(fw);
    playTone(200 + Math.random() * 400, 0.15, 'sine', 0.03);
  }

  function updateAndDrawFireworks(W, H, progress, chIdx) {
    for (let fi = rewardFireworks.length - 1; fi >= 0; fi--) {
      const fw = rewardFireworks[fi];
      let alive = false;
      for (let i = fw.particles.length - 1; i >= 0; i--) {
        const p = fw.particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.98; p.vy *= 0.98;
        p.life--;
        if (p.life <= 0) { fw.particles.splice(i, 1); continue; }
        alive = true;
        const a = p.life / p.maxLife;
        rewardCtx.globalAlpha = a;
        rewardCtx.fillStyle = p.color;
        rewardCtx.shadowColor = p.color; rewardCtx.shadowBlur = 8 * a;
        rewardCtx.beginPath(); rewardCtx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); rewardCtx.fill();
      }
      rewardCtx.shadowBlur = 0;
      if (!alive) rewardFireworks.splice(fi, 1);
    }
    rewardCtx.globalAlpha = 1;
  }

  function finishReward() {
    // チャレンジ選択に戻る
    hideAllScreens();
    challengeSelectScreen.classList.remove('hidden');
  }

  function skipReward() {
    if (rewardAnimId) { cancelAnimationFrame(rewardAnimId); rewardAnimId = null; }
    finishReward();
  }

  // =============================================
  // 初期化
  // =============================================
  function initGame() {
    score = 0; level = 1; gameOver = false; paused = false; softDropping = false;

    if (gameMode === 'endless' && startLevelInput) {
      const sl = parseInt(startLevelInput.value, 10);
      level = isNaN(sl) ? 1 : Math.max(1, Math.min(30, sl));
    } else if (gameMode === 'challenge') {
      const def = getChallengeDef();
      level = def.startLevel || 1;
    }
    lines = (level - 1) * LINES_PER_LEVEL;

    holdType = null; holdLocked = false; bag = []; lineClearEffects = []; particles = []; actionText = null; lastAction = ''; cancelLockTimer(); shuffleBag();
    dropInterval = getLevelDropInterval();

    if (gameMode === 'challenge') {
      board = generateChallengeBoard();
      challengeCleared = 0;
      challengeTarget = getStageConfig().target;
      challengeInfo.classList.remove('hidden');
      challengeModeLabel.textContent = `CHALLENGE ${challengeIndex + 1}`;
    } else {
      board = createBoard();
      challengeInfo.classList.add('hidden');
    }
    next = createPiece(getNextType()); current = createPiece(getNextType());
    gameOverOverlay.classList.add('hidden'); pauseOverlay.classList.add('hidden');
    updateUI(); draw();
    if (animationId !== null) cancelAnimationFrame(animationId); animationLoop();

    if (gameMode === 'challenge') {
      // チャレンジモード: 1秒間「READY」表示後に開始
      paused = true;
      pauseOverlay.querySelector('h2').textContent = `STAGE ${challengeStage}`;
      pauseOverlay.querySelector('.pause-hint').textContent = 'READY...';
      pauseOverlay.classList.remove('hidden');
      setTimeout(() => {
        paused = false;
        pauseOverlay.classList.add('hidden');
        pauseOverlay.querySelector('h2').textContent = 'PAUSED';
        pauseOverlay.querySelector('.pause-hint').textContent = 'Press ESC to resume';
        startDropTimer();
        startBGM();
      }, 1000);
    } else {
      startDropTimer();
      startBGM();
    }
  }

  // =============================================
  // ポーズ
  // =============================================
  function togglePause() {
    if (gameOver) return; paused = !paused;
    if (paused) { stopDropTimer(); stopBGM(); pauseOverlay.classList.remove('hidden'); }
    else { pauseOverlay.classList.add('hidden'); softDropping = false; dropInterval = getLevelDropInterval(); startDropTimer(); startBGM(); }
  }

  // =============================================
  // 画面遷移
  // =============================================
  function hideAllScreens() {
    modeSelectScreen.classList.add('hidden');
    challengeSelectScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    rewardScreen.classList.add('hidden');
  }
  function showModeSelect() {
    stopDropTimer(); stopBGM(); if (animationId !== null) { cancelAnimationFrame(animationId); animationId = null; }
    hideAllScreens(); modeSelectScreen.classList.remove('hidden');
  }
  function showChallengeSelect() {
    hideAllScreens(); challengeSelectScreen.classList.remove('hidden');
    buildChallengeGrid();
  }
  function startEndless() {
    gameMode = 'endless'; hideAllScreens(); gameScreen.classList.remove('hidden');
    ensureAudio(); initGame();
  }
  function startChallenge(idx) {
    gameMode = 'challenge'; challengeIndex = idx; challengeStage = 1;
    hideAllScreens(); gameScreen.classList.remove('hidden');
    ensureAudio(); initGame();
  }

  // =============================================
  // チャレンジ選択グリッド生成
  // =============================================
  function buildChallengeGrid() {
    challengeGridEl.innerHTML = '';
    for (let i = 0; i < CHALLENGE_DEFS.length; i++) {
      const def = CHALLENGE_DEFS[i];
      const card = document.createElement('button');
      card.className = 'challenge-card';
      card.innerHTML = `<span class="card-num" style="background:linear-gradient(135deg,${def.color},#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${i + 1}</span><span class="card-label">${def.name}</span>`;
      card.addEventListener('click', () => startChallenge(i));
      challengeGridEl.appendChild(card);
    }
  }

  // =============================================
  // キー入力
  // =============================================
  function matchKey(e, action) {
    const bound = keyBindings[action];
    if (bound === e.key) return true;
    if (bound.length === 1 && e.key.toLowerCase() === bound.toLowerCase()) return true;
    return false;
  }
  document.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('hidden')) return;
    if (matchKey(e, 'pause')) { e.preventDefault(); togglePause(); return; }

    // ゲームオーバー/ステージクリア画面時は Enter か Space でリトライ/次へ進む
    if (!gameOverOverlay.classList.contains('hidden')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        retryBtn.click();
        return;
      }
    }

    if (gameOver || paused) return;
    if (matchKey(e, 'moveLeft')) { e.preventDefault(); if (movePiece(-1, 0)) SFX.move(); draw(); }
    else if (matchKey(e, 'moveRight')) { e.preventDefault(); if (movePiece(1, 0)) SFX.move(); draw(); }
    else if (matchKey(e, 'softDrop')) { e.preventDefault(); if (!softDropping) { softDropping = true; dropInterval = SOFT_DROP_INTERVAL; startDropTimer(); } }
    else if (matchKey(e, 'rotateRight')) { e.preventDefault(); rotatePiece(1); draw(); }
    else if (matchKey(e, 'rotateLeft')) { e.preventDefault(); rotatePiece(-1); draw(); }
    else if (matchKey(e, 'hardDrop')) { e.preventDefault(); hardDrop(); }
    else if (matchKey(e, 'hold')) { e.preventDefault(); holdPiece(); }
  });
  document.addEventListener('keyup', (e) => { if (matchKey(e, 'softDrop') && softDropping) { softDropping = false; dropInterval = getLevelDropInterval(); startDropTimer(); } });

  // =============================================
  // ボタンイベント
  // =============================================
  bgmToggleEl.addEventListener('change', (e) => {
    bgmEnabled = e.target.checked;
    if (!bgmEnabled) { stopBGM(); }
    else if (!paused && !gameOver && !gameScreen.classList.contains('hidden')) { startBGM(); }
  });
  bgmVolumeEl.addEventListener('input', (e) => {
    bgmVolume = parseFloat(e.target.value);
  });

  btnEndless.addEventListener('click', startEndless);
  btnChallengeSelect.addEventListener('click', showChallengeSelect);
  btnBackMenu.addEventListener('click', showModeSelect);
  btnRewardSkip.addEventListener('click', skipReward);

  retryBtn.addEventListener('click', () => {
    if (gameMode === 'challenge' && resultTitle.classList.contains('clear-title')) {
      const def = getChallengeDef();
      if (challengeStage >= def.stages.length) {
        // 全ステージクリア → ご褒美アニメーション
        gameOverOverlay.classList.add('hidden');
        stopDropTimer();
        if (animationId !== null) { cancelAnimationFrame(animationId); animationId = null; }
        hideAllScreens();
        startRewardAnimation(challengeIndex);
        return;
      }
      challengeStage++;
    }
    retryBtn.textContent = 'RETRY';
    initGame();
  });

  menuBtn.addEventListener('click', showModeSelect);

  // =============================================
  // キー設定画面
  // =============================================
  function openKeyConfig() {
    const screen = document.getElementById('keyconfig-screen');
    hideAllScreens();
    screen.classList.remove('hidden');
    renderKeyConfig();
  }
  function renderKeyConfig() {
    const list = document.getElementById('keyconfig-list');
    list.innerHTML = '';
    for (const action of Object.keys(KEY_LABELS)) {
      const row = document.createElement('div');
      row.className = 'keyconfig-row';
      row.innerHTML = `<span class="kc-label">${KEY_LABELS[action]}</span><button class="kc-btn" data-action="${action}">${keyDisplayName(keyBindings[action])}</button>`;
      list.appendChild(row);
    }
    list.querySelectorAll('.kc-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const action = this.dataset.action;
        this.textContent = '入力待ち...';
        this.classList.add('waiting');
        const handler = (ev) => {
          ev.preventDefault(); ev.stopPropagation();
          keyBindings[action] = ev.key;
          saveKeyBindings();
          this.textContent = keyDisplayName(ev.key);
          this.classList.remove('waiting');
          document.removeEventListener('keydown', handler, true);
          updateControlsDisplay();
        };
        document.addEventListener('keydown', handler, true);
      });
    });
    const resetBtn = document.getElementById('keyconfig-reset');
    if (resetBtn) resetBtn.onclick = () => {
      keyBindings = { ...DEFAULT_KEYS };
      saveKeyBindings();
      renderKeyConfig();
      updateControlsDisplay();
    };
  }
  function updateControlsDisplay() {
    const el = document.getElementById('controls-list');
    if (!el) return;
    el.innerHTML = `
      <li>${keyDisplayName(keyBindings.moveLeft)} ${keyDisplayName(keyBindings.moveRight)} 移動</li>
      <li>${keyDisplayName(keyBindings.rotateRight)} 右回転</li>
      <li>${keyDisplayName(keyBindings.rotateLeft)} 左回転</li>
      <li>${keyDisplayName(keyBindings.softDrop)} ソフトドロップ</li>
      <li>${keyDisplayName(keyBindings.hardDrop)} ハードドロップ</li>
      <li>${keyDisplayName(keyBindings.hold)} ホールド</li>
      <li>${keyDisplayName(keyBindings.pause)} ポーズ</li>
    `;
  }

  // =============================================
  // デバッグモード
  // =============================================
  function openDebug() {
    const screen = document.getElementById('debug-screen');
    hideAllScreens();
    screen.classList.remove('hidden');
  }
  function debugStartChallenge() {
    const ci = parseInt(document.getElementById('debug-challenge').value, 10) - 1;
    const si = parseInt(document.getElementById('debug-stage').value, 10);
    if (ci < 0 || ci >= CHALLENGE_DEFS.length) return;
    const def = CHALLENGE_DEFS[ci];
    if (si < 1 || si > def.stages.length) return;
    gameMode = 'challenge'; challengeIndex = ci; challengeStage = si;
    hideAllScreens(); gameScreen.classList.remove('hidden');
    ensureAudio(); initGame();
  }
  function debugPreviewReward() {
    const ci = parseInt(document.getElementById('debug-reward-ch').value, 10) - 1;
    if (ci < 0 || ci >= CHALLENGE_DEFS.length) return;
    ensureAudio();
    startRewardAnimation(ci);
  }

  // =============================================
  // プロシージャル コサックダンサー描画
  // =============================================
  function drawCossackDancer(ctx, x, y, kick) {
    ctx.save();
    ctx.translate(x, y);
    // 帽子
    ctx.fillStyle = '#222';
    ctx.fillRect(-8, -50, 16, 8);
    ctx.fillRect(-10, -42, 20, 4);
    // 顔
    ctx.fillStyle = '#e8b88a';
    ctx.fillRect(-6, -38, 12, 10);
    // 目
    ctx.fillStyle = '#000';
    ctx.fillRect(-4, -35, 2, 2);
    ctx.fillRect(2, -35, 2, 2);
    // 口ひげ
    ctx.fillRect(-3, -30, 6, 1);
    // 体 (赤衣装)
    ctx.fillStyle = '#c62828';
    ctx.fillRect(-10, -28, 20, 18);
    // ベルト
    ctx.fillStyle = '#ffd600';
    ctx.fillRect(-10, -12, 20, 3);
    // 腕
    ctx.fillStyle = '#c62828';
    ctx.fillRect(-18, -26, 8, 5);
    ctx.fillRect(10, -26, 8, 5);
    // 手
    ctx.fillStyle = '#e8b88a';
    ctx.fillRect(-20, -22, 4, 4);
    ctx.fillRect(16, -22, 4, 4);
    // ズボン
    ctx.fillStyle = '#333';
    ctx.fillRect(-10, -10, 20, 14);
    // 足 (キックアニメ)
    const lx = kick > 0 ? kick * 12 : 0;
    const rx = kick < 0 ? kick * 12 : 0;
    ctx.fillStyle = '#222';
    ctx.fillRect(-8 - lx, 4, 6, 8);
    ctx.fillRect(2 + rx, 4, 6, 8);
    // ブーツ
    ctx.fillStyle = '#111';
    ctx.fillRect(-10 - lx, 12, 8, 4);
    ctx.fillRect(2 + rx, 12, 8, 4);
    ctx.restore();
  }

  // =============================================
  // hideAllScreens拡張
  // =============================================
  const _origHideAll = hideAllScreens;
  hideAllScreens = function () {
    _origHideAll();
    const kcScreen = document.getElementById('keyconfig-screen');
    const dbScreen = document.getElementById('debug-screen');
    if (kcScreen) kcScreen.classList.add('hidden');
    if (dbScreen) dbScreen.classList.add('hidden');
  };

  // デバッグ/キー設定ボタンイベント
  const btnKeyConfig = document.getElementById('btn-keyconfig');
  const btnDebug = document.getElementById('btn-debug');
  if (btnKeyConfig) btnKeyConfig.addEventListener('click', openKeyConfig);
  if (btnDebug) btnDebug.addEventListener('click', openDebug);
  const btnKcBack = document.getElementById('btn-keyconfig-back');
  if (btnKcBack) btnKcBack.addEventListener('click', showModeSelect);
  const btnDebugBack = document.getElementById('btn-debug-back');
  if (btnDebugBack) btnDebugBack.addEventListener('click', showModeSelect);
  const btnDebugStart = document.getElementById('btn-debug-start');
  if (btnDebugStart) btnDebugStart.addEventListener('click', debugStartChallenge);
  const btnDebugReward = document.getElementById('btn-debug-reward');
  if (btnDebugReward) btnDebugReward.addEventListener('click', debugPreviewReward);

  // 起動時にCONTROLS表示を更新
  updateControlsDisplay();

  // =============================================
  // 起動
  // =============================================
  showModeSelect();
})();
```
