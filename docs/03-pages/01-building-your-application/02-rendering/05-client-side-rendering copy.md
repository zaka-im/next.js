---
title: 클라이언트-사이드 렌더링 (CSR)
description: 페이지 라우터에서 클라이언트-사이드 렌더링을 구현하는 방법을 배워보세요.
related:
  description: Next.js에서 대체 렌더링 방법에 대해 알아보세요.
  links:
    - pages/building-your-application/rendering/server-side-rendering
    - pages/building-your-application/rendering/static-site-generation
    - pages/building-your-application/rendering/incremental-static-regeneration
    - app/building-your-application/routing/loading-ui-and-streaming
---

React의 클라이언트-사이드 렌더링 (CSR)에서 브라우저는 페이지에 필요한 최소한의 HTML 페이지와 JavaScript를 다운로드합니다. 그런 다음 JavaScript를 사용하여 DOM을 업데이트하고 페이지를 렌더링합니다. 애플리케이션이 처음 로드되면 사용자는 페이지가 완전히 렌더링되기 전에 약간의 지연이 있을 수 있습니다. 이는 페이지가 JavaScript를 모두 다운로드하고 구문 분석하고 실행하기 전까지 페이지가 완전히 렌더링되지 않기 때문입니다.

페이지가 처음 로드된 후에는 동일한 웹 사이트의 다른 페이지로 이동하는 것이 일반적으로 더 빠릅니다. 필요한 데이터만 가져오면 되기 때문에 JavaScript는 전체 페이지를 새로 고치지 않고도 페이지의 일부를 다시 렌더링할 수 있습니다.

Next.js에서는 클라이언트-사이드 렌더링을 구현하는 두 가지 방법이 있습니다.

1. 페이지에서 서버-사이드 렌더링 방법([`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 및 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)) 대신 React의 `useEffect()` 훅을 사용합니다.
2. [SWR](https://swr.vercel.app/) 또는 [TanStack Query](https://tanstack.com/query/latest/)와 같은 데이터 가져오기 라이브러리를 사용하여 클라이언트에서 데이터를 가져옵니다(권장).

다음은 Next.js 페이지에서 `useEffect()`를 사용하는 예입니다.

```jsx filename="pages/index.js"
import React, { useState, useEffect } from 'react'

export function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }

    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])

  return <p>{data ? `Your data: ${data}` : 'Loading...'}</p>
}
```

위의 예에서 컴포넌트는 `Loading...`을 렌더링하고 시작합니다. 그런 다음 데이터가 가져와지면 다시 렌더링되어 데이터가 표시됩니다.

`useEffect`에서 데이터를 가져오는 것은 오래된 React 애플리케이션에서 볼 수 있는 패턴이지만, 성능, 캐싱, 낙관적 업데이트 등을 위해 데이터 가져오기 라이브러리를 사용하는 것이 좋습니다. 여기서는 클라이언트에서 데이터를 가져오기 위해 [SWR](https://swr.vercel.app/)을 사용하는 최소 예제를 보여드리겠습니다.

```jsx filename="pages/index.js"
import useSWR from 'swr'

export function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading...</p>

  return <p>Your Data: {data}</p>
}
```

> **알아두기**:
>
> CSR은 SEO에 영향을 줄 수 있습니다. 일부 검색 엔진 크롤러는 JavaScript를 실행하지 않을 수 있으며, 따라서 애플리케이션의 초기 빈 상태 또는 로딩 상태만 볼 수 있습니다. 또한 인터넷 연결이 느린 사용자나 장치의 경우 JavaScript를 모두 로드하고 실행하기 전에 전체 페이지를 볼 수 없으므로 성능 문제가 발생할 수 있습니다. Next.js는 애플리케이션의 각 페이지에 따라 [서버-사이드 렌더링](/docs/pages/building-your-application/rendering/server-side-rendering), [정적 사이트 생성](/docs/pages/building-your-application/rendering/static-site-generation) 및 클라이언트-사이드 렌더링을 조합하여 사용할 수 있는 하이브리드 접근 방식을 제공합니다. 앱 라우터에서는 페이지가 렌더링되는 동안 [로딩 UI와 스트리밍](/docs/app/building-your-application/routing/loading-ui-and-streaming)을 사용하여 로딩 표시기를 표시할 수도 있습니다.

## EXP 대응

1. 정적 사이트 생성이나 서버 사이드 렌더링을 통해서 사전 렌더링된 웹페이지에서 특정한 컴포넌트에서 많이 바뀌는 곳은 CSR이 더 좋다고 생각됩니다.
2. 칭찬하기와 같은 많은 업데이트가 이뤄지는 곳은 CSR이 적합하다고 생각됩니다.
