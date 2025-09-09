import { getSession } from 'next-auth/react';

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const session = await getSession();

  if (!session?.user?.accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${session.user.accessToken}`,
  };

  return fetch(input, { ...init, headers });
}

// 사용 예시
// "use client";
// import { authFetch } from "@/lib/authFetch";

// export default function Example() {
//   async function loadData() {
//     const res = await authFetch("/api/protected");
//     const data = await res.json();
//     console.log(data);
//   }

//   return <button onClick={loadData}>API 호출</button>;
// }
