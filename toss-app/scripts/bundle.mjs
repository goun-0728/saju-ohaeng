// src 조각들을 하나의 모듈(src/main.js)로 합칩니다. (같은 스코프를 공유해야 해서 합쳐서 씁니다)
import { readFileSync, writeFileSync } from 'node:fs';
const head = `// 자동 생성 파일 — 직접 고치지 말고 src/saju-core.js, src/saju-render.js, src/app.js 를 고친 뒤 npm run dev/build 하세요.
import { graniteEvent, Screen, Share, closeView, generateHapticFeedback } from '@apps-in-toss/web-framework';
const API_BASE = (import.meta.env.VITE_API_BASE || 'https://saju-ohaeng.vercel.app').replace(/\\/$/, '');
`;
const parts = ['src/saju-core.js', 'src/saju-render.js', 'src/app.js'].map(f => readFileSync(new URL('../' + f, import.meta.url), 'utf8'));
writeFileSync(new URL('../src/main.js', import.meta.url), head + parts.join('\n'));
console.log('src/main.js 생성 완료');
