import { useState } from 'react';
import {
  socialLogin,
  googleSocialLogin,
  kakaoSocialLogin,
  type SocialProvider,
} from '@/api/socialAuth';

export default function SocialLoginExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 범용 소셜 로그인 함수
  const handleSocialLogin = async (provider: SocialProvider, accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await socialLogin({ provider, accessToken });
      setResult(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인 실패';
      setError(errorMessage);
      console.error(`${provider} 로그인 실패:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Google 로그인
  const handleGoogleLogin = async (accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await googleSocialLogin(accessToken);
      setResult(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google 로그인 실패';
      setError(errorMessage);
      console.error('Google 로그인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // Kakao 로그인
  const handleKakaoLogin = async (accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await kakaoSocialLogin(accessToken);
      setResult(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kakao 로그인 실패';
      setError(errorMessage);
      console.error('Kakao 로그인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">소셜 로그인 예시</h2>

      <div className="space-y-4">
        {/* 예시 버튼들 */}
        <button
          onClick={() => handleKakaoLogin('your-kakao-access-token')}
          disabled={loading}
          className="rounded bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? '로그인 중...' : 'Kakao 로그인 테스트'}
        </button>

        <button
          onClick={() => handleGoogleLogin('your-google-access-token')}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '로그인 중...' : 'Google 로그인 테스트'}
        </button>

        {/* 결과 표시 */}
        {error && (
          <div className="rounded border border-red-400 bg-red-100 p-4 text-red-700">
            오류: {error}
          </div>
        )}

        {result && (
          <div className="rounded border border-green-400 bg-green-100 p-4 text-green-700">
            <h3 className="font-bold">로그인 성공!</h3>
            <pre className="mt-2 overflow-x-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mt-8 rounded bg-gray-100 p-4">
        <h3 className="mb-2 font-bold">사용법:</h3>
        <pre className="overflow-x-auto text-sm">
          {`// 1. 범용 함수 사용
await socialLogin({ 
  provider: 'kakao', 
  accessToken: 'your-access-token' 
});

// 2. 전용 함수 사용
await kakaoSocialLogin('your-access-token');
await googleSocialLogin('your-access-token');

// 3. 커스텀 baseUrl과 함께 사용
await socialLogin({ 
  provider: 'kakao', 
  accessToken: 'your-access-token',
  baseUrl: 'https://your-domain.com'
});`}
        </pre>
      </div>
    </div>
  );
}
