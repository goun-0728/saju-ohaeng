# 사주 오행 판 — 앱인토스(토스 미니앱) 버전

웹뷰 미니앱입니다. 화면은 이 폴더(`toss-app`)에서 만들고, AI 상담 서버는 상위 폴더의 `api/ask.js`(Vercel)를 그대로 씁니다.

## 구조
- `index.html` : 앱 화면 틀 (사주 · 궁합 · 상담 탭)
- `src/saju-core.js` : 사주 계산 엔진, 음력 변환, 해석 문장
- `src/saju-render.js` : 결과 화면 그리기, 궁합, 상담 대화
- `src/app.js` : 화면 이동, 뒤로가기, 저장, 공유
- `src/main.js` : 위 세 파일을 합친 자동 생성 파일 (직접 고치지 않음)
- `apps-in-toss.config.ts` : 앱인토스 설정 (`appName`은 콘솔에 등록한 이름과 같아야 함)

## 명령어
```bash
npm install
npm run dev      # 개발 서버 (브라우저 오른쪽 아래 AIT 버튼으로 토스 환경 미리보기)
npm run build    # dist/ 생성 + saju-ohaeng.ait 생성
npm run deploy   # 앱인토스 콘솔에 .ait 업로드 (콘솔 API 키 필요)
```

## AI 상담 서버 주소
기본은 `https://saju-ohaeng.vercel.app` 입니다. 다른 주소를 쓰려면 빌드 전에 `.env` 파일에 적습니다.
```
VITE_API_BASE=https://내-주소.vercel.app
```
서버(`api/ask.js`)는 `https://saju-ohaeng.apps.tossmini.com`, `https://saju-ohaeng.private-apps.tossmini.com` 에서 오는 요청을 허용합니다. 앱 이름이 다르면 Vercel 환경변수 `TOSS_APP_NAME`에 앱 이름을 넣으세요.
