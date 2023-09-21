---
title: Automatic Static Optimization
description: Next.js는 가능하다면 앱을 정적 HTML로 자동 최적화합니다. 여기에서 작동 방식을 알아보세요.
---

Next.js는 페이지에 블로킹 데이터 요구 사항이 없는 경우 정적(사전 렌더링)으로 페이지가 정적이라고 자동으로 결정합니다. 이 결정은 페이지에 `getServerSideProps` 및 `getInitialProps`가 없는 경우에 의해 이루어집니다.

이 기능을 사용하면 Next.js가 **서버 렌더링 및 정적 생성 페이지**를 모두 포함하는 하이브리드 애플리케이션을 생성할 수 있습니다.

> 정적으로 생성된 페이지는 여전히 반응적입니다. Next.js는 애플리케이션을 클라이언트 측에서 하이드레이션하여 완전한 상호 작용성을 제공합니다.

이 기능의 주요 이점 중 하나는 최적화된 페이지가 서버 측 계산이 필요하지 않으며 여러 CDN 위치에서 최종 사용자에게 즉시 스트리밍 될 수 있다는 것입니다. 결과는 사용자에게 _매우 빠른_ 로딩 경험을 제공합니다.

## 작동 방식

`getServerSideProps` 또는 `getInitialProps`가 페이지에 있는 경우 Next.js는 요청당 페이지를 렌더링하는 **요청당 렌더링**(즉, [서버 사이드 렌더링](/docs/pages/building-your-application/rendering/server-side-rendering))으로 전환합니다.

위의 경우가 아닌 경우 Next.js는 페이지를 정적 HTML로 사전 렌더링하여 페이지를 **정적으로 최적화**합니다.

사전 렌더링 중에 라우터의 `query` 객체는 `query` 정보를 제공할 수 없으므로 비어 있습니다. 하이드레이션 후 Next.js는 애플리케이션을 업데이트하여 `query` 객체에 라우트 매개변수를 제공합니다.

다른 렌더링을 트리거하는 하이드레이션 후 쿼리가 업데이트되는 경우는 다음과 같습니다:

- 페이지가 [동적 경로](/docs/pages/building-your-application/routing/dynamic-routes)인 경우.
- 페이지에 URL에 쿼리 값이 있습니다.
- [재작성](/docs/pages/api-reference/next-config-js/rewrites)은 `query`에서 구문 분석하여 제공해야 할 수 있는 매개변수가 있을 수 있으므로 `next.config.js`에 구성됩니다.
쿼리가 완전히 업데이트되고 사용할 준비가 되었는지 구분하려면 [`next/router`](/docs/pages/api-reference/functions/use-router#router-object)의 `isReady` 필드를 활용할 수 있습니다.

> **알아두기**: [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)를 사용하는 페이지에 [동적 경로](/docs/pages/building-your-application/routing/dynamic-routes)로 추가된 매개변수는 항상 `query` 객체 내에서 사용할 수 있습니다.

`next build`는 정적으로 최적화된 페이지에 대해 `.html` 파일을 생성합니다. 예를 들어, 페이지 `pages/about.js`의 결과는 다음과 같습니다.

```bash filename="Terminal"
.next/server/pages/about.html
```

그리고 페이지에 `getServerSideProps`를 추가하면 다음과 같이 JavaScript가 됩니다.

```bash filename="Terminal"
.next/server/pages/about.js
```

## 주의 사항

- `getInitialProps`가 있는 [사용자 정의 `App`](/docs/pages/building-your-application/routing/custom-app)이 있는 경우 [정적 생성](/docs/pages/building-your-application/data-fetching/get-static-props)이 없는 페이지에서 이 최적화가 해제됩니다.
- `getInitialProps`가 있는 [사용자 정의 `Document`](/docs/pages/building-your-application/routing/custom-document)가 있는 경우 페이지가 사전 렌더링된 페이지인지 확인하기 전에 `ctx.req`가 정의되어 있는지 확인하십시오. `ctx.req`는 사전 렌더링된 페이지의 경우 `undefined`가 됩니다.
- 렌더링 트리에서 [`next/router`](/docs/pages/api-reference/functions/use-router#router-object)의 `asPath` 값을 사용하지 마십시오. 라우터의 `isReady` 필드가 `true`인 경우에만 `asPath`를 사용하십시오. 정적으로 최적화된 페이지는 서버에서 `asPath`를 알지 못하므로 프롭으로 사용하면 불일치 오류가 발생할 수 있습니다. [`active-class-name` 예제](https://github.com/vercel/next.js/tree/canary/examples/active-class-name)는 프롭으로 `asPath`를 사용하는 방법을 보여줍니다.

> **Zaka의 알아두기** [`getInitialProps`](https://nextjs.org/docs/pages/api-reference/functions/get-initial-props)는 레거시 코드입니다. `getServerSideProps`를 사용하여 데이터를 가져오는 것이 좋습니다. `getInitialProps`를 사용하는 페이지는 정적으로 최적화되지 않습니다.
