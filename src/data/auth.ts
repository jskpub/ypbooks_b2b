// 백엔드/SSO 연동 부재로 인증 프론트 목업 처리, 세션은 sessionStorage 저장 (탭 단위, 미로그인 시 RequireAuth가 /login으로 리다이렉트)

export interface SessionUser {
  employeeId: string;
  name: string;
}

interface EmployeeAccount extends SessionUser {
  password: string;
}

// 영풍문고 발급 가정 사번·비밀번호 목업 계정
const EMPLOYEE_ACCOUNTS: EmployeeAccount[] = [{ employeeId: '26020045', password: 'ypbooks1234', name: '김민서' }];

// 시연용 자동 입력값, 로그인 화면에서 Enter만으로 진입 가능하도록 제공
export const DEMO_ACCOUNT = { employeeId: EMPLOYEE_ACCOUNTS[0].employeeId, password: EMPLOYEE_ACCOUNTS[0].password };

// 인트라넷 SSO 전달 가정 사용자
const SSO_USER: SessionUser = { employeeId: '26020045', name: '김민서' };

const SESSION_KEY = 'ypbooks_b2b.session';

function saveSession(user: SessionUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSessionUser(): SessionUser | null {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  // JSON.parse 실패 시 앱 전체 렌더 중단 방지 위해 비로그인 처리 후 값 삭제
  try {
    return JSON.parse(saved) as SessionUser;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 사번 로그인. 실패 사유(빈 칸, 사번 없음, 비밀번호 틀림)는 구분하지 않고 false 하나로 돌려준다. */
export async function signInWithEmployeeId(employeeId: string, password: string) {
  await wait(600);
  const account = EMPLOYEE_ACCOUNTS.find((item) => item.employeeId === employeeId.trim() && item.password === password);
  if (!account) return false;
  saveSession({ employeeId: account.employeeId, name: account.name });
  return true;
}

/** 인트라넷 세션 확인. 시연용으로 /sso?result=fail 이면 실패한다. */
export async function signInWithSso(shouldFail: boolean) {
  await wait(1500);
  if (shouldFail) return false;
  saveSession(SSO_USER);
  return true;
}
