// 백엔드·실제 SSO 연동이 없는 MVP라 인증을 프론트에서 흉내낸다.
// 로그인 상태는 sessionStorage에 두어서, 로그인 화면을 거치지 않고 주소를 직접 입력해 들어오면
// (= 이 탭에 로그인 기록이 없으면) RequireAuth가 /login으로 돌려보낸다.

export interface SessionUser {
  employeeId: string;
  name: string;
}

interface EmployeeAccount extends SessionUser {
  password: string;
}

// 영풍문고가 발급한 사번·비밀번호라고 가정한 목업 계정.
const EMPLOYEE_ACCOUNTS: EmployeeAccount[] = [{ employeeId: '26020045', password: 'ypbooks1234', name: '김민서' }];

// 시연용: 로그인 화면 입력칸에 미리 채워 두어 Enter만 눌러도 들어가게 한다.
export const DEMO_ACCOUNT = { employeeId: EMPLOYEE_ACCOUNTS[0].employeeId, password: EMPLOYEE_ACCOUNTS[0].password };

// 인트라넷 SSO가 넘겨준다고 가정한 사용자.
const SSO_USER: SessionUser = { employeeId: '26020045', name: '김민서' };

const SESSION_KEY = 'ypbooks_b2b.session';

function saveSession(user: SessionUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSessionUser(): SessionUser | null {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  // 값이 손상돼 JSON.parse가 실패하면 앱 전체가 흰 화면으로 멈추므로, 비로그인으로 처리하고 값을 지운다.
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
