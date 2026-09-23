import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// GitHub Pages 프로젝트 페이지는 https://jskpub.github.io/ypbooks_b2b/ 서브경로에서 서빙된다.
// dev 서버는 로컬 루트(/)에서 그대로 띄우고, build(=배포용)만 이 서브경로를 base로 잡는다.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ypbooks_b2b/' : '/',
  // svgr: <svg>를 DOM에 직접 심어야 currentColor(글자색 상속)가 동작해서(EJS의 icon() 헬퍼와
  // 동일한 이유) <img src="*.svg">가 아니라 SVG를 React 컴포넌트로 import한다(`*.svg?react`).
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
