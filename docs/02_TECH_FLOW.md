# Familog — 프론트 기술 플로우 (초안)

> `familog-server`/`familog-ai`의 `docs/02_TECH_FLOW.md`와 짝을 이루는 문서. 백엔드가 "무엇을 생성해서 어떤 상태로 주는지"를 정의했다면, 이 문서는 "그 상태를 프론트가 어떻게 받아서 화면에 그리는지"를 정의한다.

---

## 1. 시스템 구성

```
[프론트 :5173] ──REST──▶ [familog-server :8080] ──HTTP──▶ [familog-ai :8000]
 React/Vite                Java/Spring, MySQL              Python/FastAPI
 화면·상태폴링              도메인·저장·상태관리              AI 생성 전담
```

프론트는 `familog-ai`를 직접 호출하지 않는다. 항상 `familog-server`를 거친다.

---

## 2. 핵심 개념: 화면은 상태(status)로 그린다

백엔드가 모든 생성물(아바타/보이스팩/낭독)을 `PENDING → PROCESSING → READY/FAILED`로 관리하므로, 프론트는 각 상태에 대응하는 화면을 미리 정해둬야 한다.

| 상태 | 아바타 화면 | 낭독(채팅) 화면 |
|---|---|---|
| PENDING/PROCESSING | mock에 쓴 이모지 placeholder 유지 | 텍스트만 먼저 보여주고 오디오 아이콘은 비활성 |
| READY | `avatarUrl` 이미지로 교체 | 오디오 아이콘 탭 가능, 가족 목소리 재생 |
| FAILED | placeholder 유지 | 표준 TTS 폴백 or 텍스트만 표시 |

지금 구현(`Avatar.tsx`, `Chat.tsx`)은 이 상태 분기가 없고 전부 mock 고정값이다. 연동 시 `FamilyMember`/`ChatMessage` 타입에 `avatarStatus`/`ttsStatus` 필드를 추가하고 폴링 훅으로 교체해야 한다.

---

## 3. 데이터 흐름 (프론트 기준)

### 3-1. 가입(온보딩) 플로우
```
Welcome: 이름 입력
  → InviteCode: 코드 검증 (POST /families/join 또는 유사 — 백엔드 계약 미정)
  → Scan: 사진 촬영 → 서버에 업로드 (POST /members, avatarStatus=PENDING 응답)
  → [갭] 보이스팩용 음성 녹음 화면 없음 — 추가 필요
  → InviteComplete: memberId 확보, 홈으로 이동
  → 홈 진입 후 GET /members 폴링하며 avatarStatus READY 되면 이모지 → avatarUrl 이미지로 교체
```

### 3-2. 게시(채팅) 플로우
```
Chat 화면에서 텍스트/음성 전송
  → POST /posts (작성자 memberId + 텍스트) → 즉시 postId 응답, 로컬에 낙관적 렌더
  → ttsStatus=PENDING으로 표시 (오디오 아이콘 비활성)
  → 폴링 또는 추후 웹소켓으로 ttsStatus READY 수신 → ttsAudioUrl 재생 가능으로 전환
```

### 3-3. 시니어 소비 플로우
```
Home: GET /members → avatarUrl 격자 렌더 (READY 아니면 placeholder)
Chat/Home 피드: 게시물 탭 → ttsAudioUrl 재생 (HTMLAudioElement)
  - 자동재생은 브라우저 정책상 제한적 → 반드시 탭(제스처) 이후에만 play()
```

---

## 4. 프론트가 기대하는 API 계약 (제안, 백엔드 확인 필요)

`familog-ai` 쪽 계약은 백엔드 문서에 정의돼 있지만, 프론트가 직접 붙는 **familog-server의 REST API**는 아직 명세가 없다. 아래는 화면 구현 기준으로 프론트가 필요로 하는 최소 엔드포인트 제안이다.

| 목적 | 메서드 | 엔드포인트(제안) | 비고 |
|---|---|---|---|
| 가족 그룹 생성 | POST | /families | 초대코드 발급 |
| 초대코드 검증/참여 | POST | /families/join | |
| 멤버 가입(사진+음성) | POST | /members | avatarStatus/voiceStatus PENDING 응답 |
| 멤버 목록(홈 격자) | GET | /families/{id}/members | avatarUrl, avatarStatus 포함 |
| 게시(채팅 메시지) | POST | /posts | ttsStatus PENDING 응답 |
| 게시물 목록/폴링 | GET | /posts?since= | ttsAudioUrl, ttsStatus |
| 프로필 수정 | PATCH | /members/{id} | 이름, 사진 재촬영 |

이 표는 프론트 관점 제안이며 백엔드 팀과 맞춰서 확정해야 한다.

---

## 5. 지금 상태 → 실제 연동 전환 지점

백엔드와 같은 원칙: **mock 먼저, 나중에 실제로 교체.** 프론트는 이미 이 원칙대로 짜여 있다.

- `src/data/mockFamily.ts` — 실제로는 `GET /members`, `GET /posts` 응답으로 대체
- `src/hooks/useLiveFeed.ts` — 웹소켓/폴링으로 교체할 지점으로 분리해둠
- `src/types.ts`의 `FamilyMember`/`ChatMessage` — `avatarUrl`, `avatarStatus`, `ttsAudioUrl`, `ttsStatus` 필드 추가 필요
- `Scan.tsx`의 `getUserMedia` 캡처 결과 — 지금은 미리보기만, 실제로는 캡처한 프레임을 `POST /members`에 업로드해야 함

---

## 6. 리스크 & 대응 (프론트 관점)

| 리스크 | 대응 |
|---|---|
| 폴링 주기를 너무 짧게 잡으면 서버 부담, 너무 길면 시니어가 오래 기다림 | 가입/게시 직후는 짧게(2~3초), 이후 점점 늘리는 폴링 |
| 오디오 자동재생 브라우저 차단 | 항상 사용자 탭 이후에만 재생, 자동재생 시도 안 함 |
| 카메라 권한 거부 | `Scan.tsx`에 폴백 문구 이미 구현됨("카메라 권한이 필요해요") |
| 백엔드 API 계약 미확정 상태로 먼저 화면을 짜야 함 | mock 데이터 구조를 API 응답 예상 형태와 최대한 비슷하게 맞춰서 교체 비용 최소화 |
| 웹소켓 미구현 상태에서 "실시간"처럼 보여야 함 | 지금은 정적 mock, 실제 웹소켓 붙기 전까지는 폴링으로 대체 가능하게 설계 |

---

## 7. 결정 기록 (프론트가 왜 이렇게 골랐나)

### 7-1. 왜 React Router로 화면을 분리했나
8개 화면이 명확한 단계(온보딩 4단계 + 탭 3~4개)로 나뉘어 있어 SPA 라우팅이 자연스럽다. 화면 간 상태 공유가 거의 없어 전역 상태관리 라이브러리 없이 각 화면이 로컬 state + 홈 mock 데이터만으로 충분했다.

### 7-2. 왜 Tailwind v4를 새로 얹었나
와이어프레임을 빠르게 색상 팔레트로 스타일링해야 해서, 유틸리티 클래스 + `@theme` 토큰으로 베이지/오렌지/옐로우 팔레트를 한 곳에서 관리하도록 했다(`src/index.css`).

### 7-3. 왜 지금은 캐릭터를 이모지로 대체했나
`familog-ai`의 `/avatar`가 아직 붙지 않은 상태에서 실제 캐릭터 PNG가 없다. Apple Memoji는 라이선스상 재현이 불가능해 이모지+색상 원으로 임시 처리하고, `avatarUrl`이 채워지는 즉시 이미지로 교체할 수 있게 컴포넌트 구조(`Avatar.tsx`)를 분리해뒀다.

### 7-4. Node 버전
레포의 시스템 node(v16)로는 vite8/tailwind4가 동작하지 않는다(`node:util`에 `styleText` export 없음). nvm으로 22를 설치해 사용 중 — 다른 팀원도 로컬에서 `nvm use 22` 필요.

---

## 8. 아직 안 정한 것

- familog-server REST API 정확한 스펙(엔드포인트명, 응답 스키마) — 4번 표는 프론트 제안일 뿐
- 보이스팩 등록(음성 녹음) 온보딩 화면 추가 여부/디자인
- 폴링 주기, 혹은 웹소켓으로 바로 갈지
- 이미지/오디오 파일 접근 방식(정적 URL로 바로 오는지, 서명된 URL인지)
- 시니어 전용 모드 라우트 분리 여부
