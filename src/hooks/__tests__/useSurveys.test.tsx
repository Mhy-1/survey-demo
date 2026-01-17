import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSurveys } from '../useSurveys'
import * as surveyService from '@/services/api/survey.service'

// Mock the survey service
vi.mock('@/services/api/survey.service')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSurveys', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches surveys successfully', async () => {
    const mockSurveys = {
      data: [
        {
          id: '1',
          title: 'Test Survey',
          description: 'Test Description',
          status: 'active',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }

    vi.mocked(surveyService.getSurveys).mockResolvedValue(mockSurveys)

    const { result } = renderHook(() => useSurveys(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockSurveys)
  })

  it('handles error when fetching surveys', async () => {
    const error = new Error('Failed to fetch surveys')
    vi.mocked(surveyService.getSurveys).mockRejectedValue(error)

    const { result } = renderHook(() => useSurveys(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(error)
  })
})
