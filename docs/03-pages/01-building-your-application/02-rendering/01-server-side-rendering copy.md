---
title: 서버사이드 렌더링 (SSR)
description: 서버사이드 렌더링을 사용하여 각 요청마다 페이지를 렌더링합니다.
---

> "SSR" 또는 "동적 렌더링"이라고도 합니다.

만약 페이지가 **서버사이드 렌더링**을 사용한다면, 페이지 HTML은 **각 요청마다** 생성됩니다.

페이지에 서버사이드 렌더링을 사용하려면, `getServerSideProps`라는 `async` 함수를 `export` 해야 합니다. 이 함수는 서버에서 각 요청마다 호출됩니다.

예를 들어, 페이지가 외부 API에서 가져온 자주 업데이트되는 데이터를 미리 렌더링해야 한다고 가정해봅시다. 이 데이터를 가져오고 `Page`에 전달하는 `getServerSideProps`를 아래와 같이 작성할 수 있습니다.

```jsx
export default function Page({ data }) {
  // 데이터 렌더링...
}

// 이 함수는 모든 요청마다 호출됩니다.
export async function getServerSideProps() {
  // 외부 API에서 데이터 가져오기
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // 데이터를 페이지에 props로 전달합니다.
  return { props: { data } }
}
```

보시다시피, `getServerSideProps`는 `getStaticProps`와 비슷하지만, 차이점은 `getServerSideProps`는 빌드 시간이 아닌 각 요청마다 실행된다는 것입니다.

`getServerSideProps`가 어떻게 작동하는지 자세히 알아보려면, [데이터 가져오기 문서](/docs/pages/data-fetching/get-server-side-props)를 확인해주세요.

---

