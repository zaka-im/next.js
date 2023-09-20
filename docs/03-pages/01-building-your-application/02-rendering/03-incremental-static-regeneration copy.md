---
title: Incremental Static Regeneration(ISR)
description: Incremental Static Regeneration을 사용하여 런타임에 정적 페이지를 생성하거나 업데이트하는 방법을 알아보세요.
---

<details>
  <summary>예시</summary>

- [Next.js Commerce](https://nextjs.org/commerce)
- [GitHub Reactions Demo](https://reactions-demo.vercel.app/)
- [Static Tweet Demo](https://static-tweet.vercel.app/)

</details>

Next.js를 사용하면 사이트를 빌드한 후에도 정적 페이지를 생성하거나 업데이트할 수 있습니다. Incremental Static Regeneration(ISR)을 사용하면 정적 생성을 페이지별로 사용할 수 있으며, **전체 사이트를 다시 빌드할 필요 없이** 확장성을 높일 수 있습니다.

> **참고**: [`edge` 런타임](/docs/app/api-reference/edge)은 현재 ISR과 호환되지 않습니다. 하지만 `cache-control` 헤더를 수동으로 설정하여 `stale-while-revalidate`을 활용할 수 있습니다.

ISR을 사용하려면 `getStaticProps`에 `revalidate` 속성을 추가하세요.

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// 이 함수는 서버 사이드에서 빌드 시에 호출됩니다.
// revalidation이 활성화되어 있고 새 요청이 들어오면
// 서버리스 함수에서 다시 호출될 수 있습니다.
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js는 페이지를 다시 생성하려고 시도합니다.
    // - 요청이 들어올 때
    // - 10초에 한 번 이상
    revalidate: 10, // 초 단위
  }
}

// 이 함수는 서버 사이드에서 빌드 시에 호출됩니다.
// 해당 경로가 생성되지 않았다면 서버리스 함수에서 다시 호출됩니다.
export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // posts를 기반으로 사전 렌더링할 경로를 가져옵니다.
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // 이 경로만 사전 렌더링합니다.
  // { fallback: 'blocking' }은 경로가 존재하지 않을 경우
  // 요청 시에 서버사이드 렌더링합니다.
  return { paths, fallback: 'blocking' }
}

export default Blog
```

빌드 시에 사전 렌더링된 페이지에 요청이 들어오면, 캐시된 페이지가 먼저 표시됩니다.

- 초기 요청 이후 10초 이전에 요청이 들어오면 캐시된 페이지가 표시됩니다.
- 10초 이후에 요청이 들어오면 캐시된 페이지가 표시됩니다.
- Next.js는 백그라운드에서 페이지를 다시 생성합니다.
- 페이지가 성공적으로 생성되면 Next.js는 캐시를 무효화하고 업데이트된 페이지를 표시합니다. 백그라운드에서 생성이 실패하면 이전 페이지가 그대로 유지됩니다.

생성되지 않은 경로에 요청이 들어오면, Next.js는 첫 번째 요청에 대해 서버사이드 렌더링합니다. 이후 요청은 캐시된 정적 파일을 표시합니다. Vercel에서는 [캐시를 전역적으로 유지하고 롤백을 처리합니다](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration?utm_source=next-site&utm_medium=docs&utm_campaign=next-website).

> **참고**: On-Demand ISR은 [미들웨어](/docs/app/building-your-application/routing/middleware)에서 실행되지 않습니다. 대신, 정적 페이지를 다시 유효화하려면 정확한 경로를 `revalidate()`에 전달해야 합니다. 예를 들어, `pages/blog/[slug].js`와 `/post-1` -> `/blog/post-1`에 대한 리라이트가 있다면, `res.revalidate('/blog/post-1')`를 호출해야 합니다.

## On-Demand Revalidation

`revalidate` 속성을 `60`으로 설정하면 모든 방문자는 1분 동안 동일한 생성된 버전의 사이트를 볼 수 있습니다. 캐시를 무효화하려면 1분이 지난 후에 해당 페이지에 대한 요청을 보내야 합니다.

`v12.2.0`부터 Next.js는 특정 페이지에 대한 캐시를 수동으로 무효화할 수 있는 On-Demand Incremental Static Regeneration을 지원합니다. 이를 통해 다음과 같은 경우 사이트를 업데이트하기 쉬워집니다.

- headless CMS에서 콘텐츠가 생성되거나 업데이트되는 경우
- 전자상거래 메타데이터가 변경되는 경우(가격, 설명, 카테고리, 리뷰 등)

`getStaticProps`에서 `revalidate`를 지정하지 않으면 On-Demand Revalidation을 사용할 수 있습니다. `revalidate`가 생략된 경우 Next.js는 기본값인 `false`(재검증 없음)을 사용하고, `revalidate()`가 호출될 때만 페이지를 On-Demand로 재검증합니다.

> **참고**: [미들웨어](/docs/app/building-your-application/routing/middleware)는 On-Demand ISR 요청에 대해 실행되지 않습니다. 대신, 정확한 경로에 대해 `revalidate()`를 호출해야 합니다. 예를 들어, `pages/blog/[slug].js`와 `/post-1` -> `/blog/post-1`에 대한 리라이트가 있다면, `res.revalidate('/blog/post-1')`를 호출해야 합니다.

### On-Demand Revalidation 사용하기

먼저, Next.js 앱에서만 알 수 있는 토큰을 만듭니다. 이 토큰은 무단 액세스를 방지하기 위해 On-Demand ISR API 라우트에 사용됩니다. 다음 URL 구조로 라우트에 액세스할 수 있습니다(수동으로 또는 웹훅을 사용하여).

```bash filename="Terminal"
https://<your-site.com>/api/revalidate?secret=<token>
```

다음으로, 앱에 [환경 변수](/docs/pages/building-your-application/configuring/environment-variables)로 비밀을 추가합니다. 마지막으로, revalidation API 라우트를 만듭니다.

```js filename="pages/api/revalidate.js"
export default async function handler(req, res) {
  // secret이 올바른지 확인합니다.
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // 실제 경로여야 합니다. 리라이트된 경로가 아닙니다.
    // 예를 들어, "/blog/[slug]"의 경우 "/blog/post-1"이어야 합니다.
    await res.revalidate('/path-to-revalidate')
    return res.json({ revalidated: true })
  } catch (err) {
    // 에러가 발생하면 Next.js는
    // 마지막으로 성공적으로 생성된 페이지를 계속 표시합니다.
    return res.status(500).send('Error revalidating')
  }
}
```

On-Demand Revalidation을 실제로 사용하는 방법을 보려면 [데모](https://on-demand-isr.vercel.app)를 확인하고 피드백을 제공하세요.

### 개발 중 On-Demand ISR 테스트하기

`next dev`로 로컬에서 실행할 때, `getStaticProps`는 모든 요청에 대해 호출됩니다. On-Demand ISR 구성이 올바른지 확인하려면 [프로덕션 빌드](/docs/pages/api-reference/next-cli#build)를 만들고 [프로덕션 서버](/docs/pages/api-reference/next-cli#production)를 시작해야 합니다.

```bash filename="Terminal"
$ next build
$ next start
```

그런 다음, 정적 페이지가 성공적으로 재검증되었는지 확인할 수 있습니다.

## 에러 처리 및 재검증

백그라운드 재생성을 처리하는 `getStaticProps` 내부에 에러가 발생하거나, 수동으로 에러를 throw하는 경우, 마지막으로 성공적으로 생성된 페이지가 계속 표시됩니다. 다음 요청에서 Next.js는 `getStaticProps`를 다시 호출하려고 합니다.

```jsx
export async function getStaticProps() {
  // 이 요청이 uncaught error를 throw하면 Next.js는
  // 현재 표시된 페이지를 무효화하지 않고
  // 다음 요청에서 getStaticProps를 재시도합니다.
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  if (!res.ok) {
    // 서버 에러가 발생하면 캐시를 업데이트하지 않고
    // 다음 성공적인 요청까지 유지하려면 에러를 throw할 수 있습니다.
    throw new Error(`Failed to fetch posts, received status ${res.status}`)
  }

  // 요청이 성공하면 포스트를 반환하고
  // 10초마다 재검증합니다.
  return {
    props: {
      posts,
    },
    revalidate: 10,
  }
}
```

## ISR 셀프 호스팅

Incremental Static Regeneration(ISR)은 `next start`를 사용하여 [셀프 호스팅 Next.js 사이트](/docs/pages/building-your-application/deploying#self-hosting)에서 기본적으로 작동합니다.

이 방법은 [Kubernetes](https://kubernetes.io/) 또는 [HashiCorp Nomad](https://www.nomadproject.io/)와 같은 컨테이너 오케스트레이터에 배포할 때 사용할 수 있습니다. 기본적으로 생성된 에셋은 각 pod의 메모리에 저장됩니다. 이는 각 pod가 정적 파일의 자체 복사본을 가지고 있다는 것을 의미합니다. 특정 pod에 요청이 들어올 때까지 오래된 데이터가 표시될 수 있습니다.

모든 pod에서 일관성을 유지하려면, 메모리 내 캐시를 비활성화할 수 있습니다. 이렇게 하면 Next.js 서버가 파일 시스템에서만 ISR에 의해 생성된 에셋을 활용하도록 알릴 수 있습니다.

Kubernetes pod(또는 유사한 설정)에서 공유 네트워크 마운트를 사용하여 다른 컨테이너 간에 동일한 파일 시스템 캐시를 재사용할 수 있습니다. 동일한 마운트를 공유함으로써 `next/image` 캐시를 포함하는 `.next` 폴더도 공유되고 재사용됩니다.

메모리 내 캐시를 비활성화하려면 `next.config.js` 파일에서 `isrMemoryCacheSize`를 `0`으로 설정하세요.

```js filename="next.config.js"
module.exports = {
  experimental: {
    // 기본값은 50MB입니다.
    isrMemoryCacheSize: 0,
  },
}
```

> **참고**: 공유 마운트가 어떻게 구성되었는지에 따라 여러 pod가 동시에 캐시를 업데이트하려고 하는 경합 조건을 고려해야 할 수 있습니다.

## 버전 기록

| 버전     | 변경 사항                                                                                   |
| -------- | ------------------------------------------------------------------------------------------ |
| `v12.2.0` | On-Demand ISR이 안정화되었습니다.                                                           |
| `v12.1.0` | On-Demand ISR이 추가되었습니다(베타).                                                       |
| `v12.0.0` | [Bot-aware ISR fallback](https://nextjs.org/blog/next-12#bot-aware-isr-fallback)이 추가되었습니다. |
| `v9.5.0` | Base Path가 추가되었습니다.                                                                 |