// 사주 상담 API — Vercel 서버리스 함수
// 필요한 환경변수: ANTHROPIC_API_KEY
// 선택 환경변수: ASK_MODEL, ASK_DAILY_LIMIT(1인 하루 질문 수, 기본 15), ASK_GLOBAL_DAILY_LIMIT(전체 하루, 기본 500),
//               ASK_ACCESS_CODE(설정하면 이 코드를 입력한 사람만 사용), ALLOWED_ORIGINS(쉼표 구분 도메인, 설정하면 그 도메인과 토스 미니앱만 허용), TOSS_APP_NAME(앱인토스 앱 이름, 기본 saju-ohaeng)

const MODEL = process.env.ASK_MODEL || 'claude-haiku-4-5-20251001';
const DAILY = +(process.env.ASK_DAILY_LIMIT || 15);
const GLOBAL = +(process.env.ASK_GLOBAL_DAILY_LIMIT || 500);

// 인스턴스 메모리 기반 제한(가볍게 막는 용도)
const perIp = new Map();
let globalDay = '', globalCount = 0;
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

const SYSTEM = `당신은 30년 경력의 한국 명리학 상담가입니다. 사용자의 사주 정보가 [사주 정보]로 주어집니다.
규칙:
- 반드시 주어진 사주 정보(원국, 오행, 강약, 격국, 용신·희신·기신, 대운, 세운, 신살, 합충, MBTI)를 근거로 답합니다. 사주를 다시 계산하거나 정보를 지어내지 않습니다.
- 사주팔자 명리 용어(일간, 용신, 대운, 세운, 십성 등)를 자연스럽게 섞되, 일반인이 이해하기 쉽게 풀어 씁니다.
- 결론부터 말하고, 300~500자 정도로 짜임새 있게 답합니다. 필요하면 짧은 소제목이나 목록을 씁니다.
- 시기를 물으면 대운·세운 정보에서 구체적인 연도를 짚어 줍니다.
- 나이에 맞게 답합니다. 미성년자에게는 연애·결혼·투자 이야기를 하지 않고 학업·성장·친구 중심으로 답합니다.
- 겁주거나 단정하지 않습니다. 운은 흐름이고 선택은 본인의 몫이라는 태도로, 어려운 운도 대처법과 함께 말합니다.
- 건강·법률·투자처럼 중요한 결정은 사주는 참고일 뿐이며 전문가와 상의하라고 한 줄 덧붙입니다.
- 사주와 무관한 질문, 다른 사람을 해치거나 저주하는 질문에는 정중히 사주 상담 범위만 답한다고 말합니다.
- 판단 근거나 계산 방법을 길게 설명하지 말고, 결과와 조언 위주로 답합니다.`;

// 앱인토스 미니앱이 실행되는 도메인 (라이브 · 콘솔 QR 테스트)
const TOSS_APP = process.env.TOSS_APP_NAME || 'saju-ohaeng';
const TOSS_ORIGINS = [`https://${TOSS_APP}.apps.tossmini.com`, `https://${TOSS_APP}.private-apps.tossmini.com`];

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.headers.origin || '';
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const host = req.headers.host || '';
  const sameSite = origin && host && origin.replace(/^https?:\/\//, '') === host;
  const allowedOrigin = !origin || sameSite || TOSS_ORIGINS.includes(origin) || (extra.length ? extra.some(a => origin === a || origin.endsWith(a)) : true);
  if (origin && allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') return res.status(allowedOrigin ? 204 : 403).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 지원합니다.' });
  if (!allowedOrigin) return res.status(403).json({ error: '허용되지 않은 사이트입니다.' });

  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: '상담 기능이 아직 설정되지 않았습니다. (API 키 없음)' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { question, brief, history, code } = body;

  if (process.env.ASK_ACCESS_CODE && code !== process.env.ASK_ACCESS_CODE) return res.status(401).json({ error: '입장 코드가 맞지 않습니다.', needCode: true });
  if (!question || typeof question !== 'string' || !question.trim()) return res.status(400).json({ error: '질문을 입력해 주세요.' });
  if (question.length > 300) return res.status(400).json({ error: '질문은 300자 이내로 입력해 주세요.' });
  if (!brief || typeof brief !== 'string' || brief.length > 6000) return res.status(400).json({ error: '사주 정보가 올바르지 않습니다. 사주를 먼저 확인해 주세요.' });

  const d = today();
  if (globalDay !== d) { globalDay = d; globalCount = 0; perIp.clear(); }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const used = perIp.get(ip) || 0;
  if (used >= DAILY) return res.status(429).json({ error: `오늘 질문은 ${DAILY}번까지입니다. 내일 다시 이용해 주세요.` });
  if (globalCount >= GLOBAL) return res.status(429).json({ error: '오늘 상담이 많아 마감되었습니다. 내일 다시 이용해 주세요.' });

  const past = Array.isArray(history) ? history.slice(-6).filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 1500) })) : [];
  const messages = [...past, { role: 'user', content: question.trim() }];
  if (messages[0].role !== 'user') messages.shift();

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, system: `${SYSTEM}\n\n[사주 정보]\n${brief}`, messages })
    });
    const j = await r.json();
    if (!r.ok) {
      console.error('anthropic error', r.status, j && j.error);
      return res.status(502).json({ error: '상담 서버가 잠시 응답하지 않습니다. 잠시 후 다시 시도해 주세요.' });
    }
    perIp.set(ip, used + 1); globalCount++;
    const answer = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    return res.status(200).json({ answer, left: DAILY - used - 1 });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '상담 중 오류가 났습니다. 다시 시도해 주세요.' });
  }
};
