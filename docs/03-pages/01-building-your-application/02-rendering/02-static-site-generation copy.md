---
title: 정적 사이트 생성 (SSG)
description: 정적 사이트 생성 (SSG)을 사용하여 빌드 시간에 페이지를 사전 렌더링합니다.
---

<details>
  <summary>예시</summary>

- [WordPress 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress)([Demo](https://next-blog-wordpress.vercel.app))
- [마크다운 파일을 사용한 블로그 스타터](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) ([Demo](https://next-blog-starter.vercel.app/))
- [DatoCMS 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-datocms) ([Demo](https://next-blog-datocms.vercel.app/))
- [TakeShape 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape) ([Demo](https://next-blog-takeshape.vercel.app/))
- [Sanity 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-sanity) ([Demo](https://next-blog-sanity.vercel.app/))
- [Prismic 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-prismic) ([Demo](https://next-blog-prismic.vercel.app/))
- [Contentful 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-contentful) ([Demo](https://next-blog-contentful.vercel.app/))
- [Strapi 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-strapi) ([Demo](https://next-blog-strapi.vercel.app/))
- [Prepr 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-prepr) ([Demo](https://next-blog-prepr.vercel.app/))
- [Agility CMS 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))
- [Cosmic 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic) ([Demo](https://next-blog-cosmic.vercel.app/))
- [ButterCMS 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms) ([Demo](https://next-blog-buttercms.vercel.app/))
- [Storyblok 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok) ([Demo](https://next-blog-storyblok.vercel.app/))
- [GraphCMS 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms) ([Demo](https://next-blog-graphcms.vercel.app/))
- [Kontent 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-kontent-ai) ([Demo](https://next-blog-kontent.vercel.app/))
- [Builder.io 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io) ([Demo](https://cms-builder-io.vercel.app/))
- [TinaCMS 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-tina) ([Demo](https://cms-tina-example.vercel.app/))
- [정적 트윗 (데모)](https://static-tweet.vercel.app/)
- [Enterspeed 예시](https://github.com/vercel/next.js/tree/canary/examples/cms-enterspeed) ([Demo](https://next-blog-demo.enterspeed.com/))

</details>

페이지가 **정적 생성**을 사용하는 경우 페이지 HTML은 **빌드 시간**에 생성됩니다. 즉, 프로덕션에서 페이지 HTML은 `next build`를 실행할 때 생성됩니다. 이 HTML은 그런 다음 각 요청에 재사용됩니다. CDN에 의해 캐시될 수 있습니다.

Next.js에서는 데이터와 함께 정적 페이지를 생성하거나 데이터 없이 정적 페이지를 생성할 수 있습니다. 각 경우를 살펴보겠습니다.

### 데이터 없이 정적 생성

기본적으로 Next.js는 데이터를 가져 오지 않고 정적 생성을 사용하여 페이지를 사전 렌더링합니다. 예를 들어:

```jsx
function About() {
  return <div>About</div>
}

export default About
```

이 페이지는 사전 렌더링하기 위해 외부 데이터를 가져올 필요가 없습니다. 이 경우 Next.js는 빌드 시간에 페이지당 하나의 HTML 파일을 생성합니다.

### 데이터와 함께 정적 생성

일부 페이지는 사전 렌더링을 위해 외부 데이터를 가져와야합니다. 두 가지 시나리오가 있으며 하나 또는 둘 다가 적용될 수 있습니다. 각 경우에 Next.js가 제공하는 이러한 함수를 사용할 수 있습니다.

1. 페이지 **콘텐츠**는 외부 데이터에 따라 다릅니다. `getStaticProps`를 사용하십시오.
2. 페이지 **경로**는 외부 데이터에 따라 다릅니다. `getStaticPaths`를 사용하십시오 (일반적으로 `getStaticProps`와 함께).

#### 시나리오 1: 페이지 콘텐츠는 외부 데이터에 따라 다릅니다.

**예시**: 블로그 페이지는 CMS (콘텐츠 관리 시스템)에서 블로그 게시물 목록을 가져와야 할 수 있습니다.

```jsx
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}
```

이 페이지를 사전 렌더링하기 위해 데이터를 가져오려면 Next.js에서 동일한 파일에서 `getStaticProps`라는 `async` 함수를 `export` 할 수 있습니다. 이 함수는 빌드 시간에 호출되며 사전 렌더링 된 페이지의 `props`에 가져온 데이터를 전달 할 수 있습니다.

```jsx
export default function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

`getStaticProps`가 작동하는 방법에 대해 자세히 알아보려면 [데이터 가져오기 문서](/docs/pages/building-your-application/data-fetching/get-static-props)를 확인하세요.

#### 시나리오 2: 페이지 경로는 외부 데이터에 따라 다릅니다.

Next.js는 **동적 경로**를 사용하여 페이지를 만들 수 있습니다. 예를 들어, `id`를 기반으로 단일 블로그 게시물을 표시하는 `pages/posts/[id].js`라는 파일을 만들 수 있습니다. 이렇게하면 `posts/1`에 액세스 할 때 `id: 1`의 블로그 게시물을 표시할 수 있습니다.

> 동적 라우팅에 대해 자세히 알아보려면 [동적 라우팅 문서](/docs/pages/building-your-application/routing/dynamic-routes)를 확인하세요.

그러나 어떤 `id`를 빌드 시간에 사전 렌더링하려는지는 외부 데이터에 따라 다를 수 있습니다.

**예시**: 데이터베이스에 `id: 1`의 블로그 게시물 (하나)만 추가했다고 가정 해보십시오. 이 경우 빌드 시간에 `posts/1`만 사전 렌더링하려고합니다.

나중에 `id: 2`의 두 번째 게시물을 추가 할 수 있습니다. 그런 다음 `posts/2`도 사전 렌더링하려고합니다.

따라서 사전 렌더링되는 페이지 **경로**는 외부 데이터에 따라 다릅니다. 이를 처리하기 위해 Next.js는 동적 페이지 (`pages/posts/[id].js`의 경우)에서 `async` 함수 인 `getStaticPaths`를 `export` 할 수 있습니다. 이 함수는 빌드 시간에 호출되며 사전 렌더링 할 경로를 지정할 수 있습니다.

```jsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

또한 `pages/posts/[id].js`에서 이 `id`에 대한 게시물의 데이터를 가져와 페이지를 사전 렌더링하는 데 사용할 수 있도록 `getStaticProps`를 `export`해야합니다.

```jsx
export default function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}
```

`getStaticPaths`가 작동하는 방법에 대해 자세히 알아보려면 [데이터 가져오기 문서](/docs/pages/building-your-application/data-fetching/get-static-paths)를 확인하세요.

### 정적 생성을 언제 사용해야합니까?

사용 가능한 경우 **정적 생성** (데이터와 함께 또는 데이터 없이)을 사용하는 것이 좋습니다. 페이지를 CDN에 의해 캐시 할 수 있기 때문에 서버가 요청마다 페이지를 렌더링하는 것보다 훨씬 빠릅니다.

많은 유형의 페이지에 정적 생성을 사용할 수 있습니다.

- 마케팅 페이지
- 블로그 게시물 및 포트폴리오
- 전자 상거래 제품 목록
- 도움말 및 문서

자신에게 "사용자의 요청 **앞에서**이 페이지를 사전 렌더링 할 수 있습니까?"라고 물어보십시오. 답이 "예"이면 정적 생성을 선택해야합니다.

반면에 사용자의 요청 앞에서 페이지를 사전 렌더링 할 수 없는 경우 정적 생성은 **좋은 아이디어가 아닙니다**. 페이지가 자주 업데이트되는 데이터를 표시하고 페이지 콘텐츠가 모든 요청마다 변경되는 경우입니다.

이러한 경우 다음 중 하나를 수행 할 수 있습니다.

- **클라이언트 측 데이터 가져 오기를 사용하십시오.** 페이지의 일부를 사전 렌더링하지 않고 클라이언트 측 JavaScript를 사용하여 해당 페이지를 채울 수 있습니다. 이 접근 방식에 대해 자세히 알아보려면 [데이터 가져 오기 문서](/docs/pages/building-your-application/data-fetching/client-side)를 확인하세요.
- **서버 측 렌더링을 사용하십시오.** Next.js는 각 요청에 대해 페이지를 사전 렌더링합니다. CDN에 의해 캐시 될 수 없으므로 느릴 수 있지만 사전 렌더링 된 페이지는 항상 최신 상태가됩니다. 이 접근 방식에 대해 자세히 알아보겠습니다.