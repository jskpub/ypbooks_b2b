// GitHub Pages는 없는 경로를 index.html로 넘겨 주지 못해서, /cart 같은 주소로 바로 들어오면 404가 난다.
// 빌드 결과(index.html)를 경로마다 `<경로>.html`로 복사해 두면 GitHub Pages가 /cart → cart.html을
// 리다이렉트 없이 200으로 내려준다. 경로 목록은 App.tsx의 path='...'에서 읽어서 라우트를 추가해도 따로 고칠 곳이 없다.
// /books/:isbn13처럼 값이 들어가는 경로는 빌드 때 주소를 알 수 없으니 404.html(같은 앱 화면)로 넘어간다.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const app = readFileSync('src/App.tsx', 'utf8');
const paths = [...app.matchAll(/path='([^']+)'/g)].map((match) => match[1]).filter((path) => path !== '/' && !path.includes(':'));

for (const path of paths) {
  const target = `dist${path}.html`;
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync('dist/index.html', target);
}
copyFileSync('dist/index.html', 'dist/404.html');

console.log(`spa-routes: ${paths.length}개 경로 + 404.html 생성`);
