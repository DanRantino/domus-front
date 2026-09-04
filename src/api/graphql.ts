import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { apiBaseUrl } from '#/auth/paths'

export type GraphqlError = {
  message: string
  extensions?: { code?: string }
}

type GraphqlResponse<T> = {
  data?: T | null
  errors?: GraphqlError[]
}

function joinUrl(base: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

function graphqlError(errors: GraphqlError[] | undefined, status: number): FetchBaseQueryError {
  const code = errors?.find((error) => error.extensions?.code)?.extensions?.code
  return {
    status,
    data: code ? { code } : errors,
  }
}

export async function executeGraphql<T>(
  query: string,
): Promise<{ data: T } | { error: FetchBaseQueryError }> {
  try {
    const response = await fetch(joinUrl(apiBaseUrl(), '/graphql'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query }),
    })

    const text = await response.text()
    let parsed: unknown
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown
      } catch {
        parsed = text
      }
    }

    if (!response.ok) {
      if (
        parsed &&
        typeof parsed === 'object' &&
        'errors' in parsed &&
        Array.isArray(parsed.errors)
      ) {
        return { error: graphqlError(parsed.errors as GraphqlError[], response.status) }
      }

      return {
        error: {
          status: response.status,
          data: parsed,
        },
      }
    }

    const body = parsed as GraphqlResponse<T>
    if (body.errors && body.errors.length > 0) {
      return { error: graphqlError(body.errors, response.status) }
    }

    if (body.data === null || body.data === undefined) {
      return { error: graphqlError(body.errors, 500) }
    }

    return { data: body.data }
  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}
