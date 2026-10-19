# Knot Studio — 뜨개공방

뜨개질 공방 웹사이트 (Vite + React + Tailwind). 원데이클래스 예약, 정규 강의, 실/도안 샵.

- 개발: `npm install && npm run dev`
- 배포: main에 push하면 GitHub Actions가 빌드해서 Pages에 배포 (`BASE_PATH=/knot-studio-landing/`)
- 샵 상품 데이터는 Supabase: 저장소 Settings → Variables에 `VITE_PUBLIC_SUPABASE_URL`, `VITE_PUBLIC_SUPABASE_ANON_KEY`를 넣으면 반영됨 (`.env`는 커밋하지 않음)

## 다운로드한 ZIP으로 실행하기

모든 이미지는 `public/images/`에 포함돼 있어요(외부 링크 없음).

```
npm install
npm run dev      # 개발 서버 (http://localhost:3000, BASE_PATH 기본 "/")
```
> 코드 안의 이미지 경로는 배포 주소(`/knot-studio-landing/`) 기준이에요. 로컬에서 이미지가 안 보이면 `BASE_PATH=/knot-studio-landing/ npm run dev`로 실행하세요.
