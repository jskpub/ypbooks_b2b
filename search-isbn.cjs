const PROXY_URL = 'https://ypbooks-b2b-aladin-proxy.ypbookb2b.workers.dev';
async function search(q) {
  const res = await fetch(`${PROXY_URL}/api/aladin/search?Query=${encodeURIComponent(q)}&QueryType=Keyword&MaxResults=1`);
  const data = await res.json();
  console.log(q, ':', data.item?.[0]?.isbn13);
}
async function run() {
  await search('구글 엔지니어는 이렇게 일한다');
  await search('지적 대화를 위한 넓고 얕은 지식 1');
  await search('칩워');
}
run();
