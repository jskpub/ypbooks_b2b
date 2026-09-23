// 헤더(utility-bar/brand-bar/gnb/category-menu/header-sticky)와 footer만 확인하기 위한 QA용 페이지.
// Layout이 모든 라우트에 자동으로 씌워지므로, 새 페이지는 이 파일처럼 컴포넌트 하나 만들고
// App.tsx에 <Route> 한 줄만 추가하면 된다 (예전 EJS 템플릿 복사 방식과 달리 include가 필요 없음).
export default function LayoutPreviewPage() {
  return (
    // 임시 높이 지정
    <main id='main' className='main' style={{ height: '1000px' }}>
      <div className='container'>
        <h1>공통 레이아웃</h1>
      </div>
    </main>
  );
}
