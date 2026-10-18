# 사주 오행 판

생년월일시로 사주팔자·오행·대운·연도별 운세·궁합·MBTI를 보고, AI에게 사주 상담을 받는 웹페이지입니다.

- `index.html` : 화면 전체 (계산은 모두 브라우저에서 동작)
- `api/ask.js` : AI 사주 상담용 Vercel 서버 함수 (Claude API 호출)

## Vercel 환경변수
| 이름 | 필수 | 설명 |
|---|---|---|
| `ANTHROPIC_API_KEY` | 필수 | console.anthropic.com 에서 발급한 API 키 |
| `ASK_DAILY_LIMIT` | 선택 | 한 사람(IP)당 하루 질문 수, 기본 15 |
| `ASK_GLOBAL_DAILY_LIMIT` | 선택 | 전체 하루 질문 수, 기본 500 |
| `ASK_ACCESS_CODE` | 선택 | 설정하면 이 코드를 아는 사람만 상담 가능 |
| `ALLOWED_ORIGINS` | 선택 | 호출을 허용할 도메인(쉼표 구분), 예: `saju-ohaeng.vercel.app` |
| `ASK_MODEL` | 선택 | 사용할 모델 ID, 기본 `claude-haiku-4-5-20251001` |
