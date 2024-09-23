'use client'

import { useEffect, useReducer, useState } from "react";


interface ReducerState {
  data: any[]
  finishedCount: number
  runningCount: number
  output?: any[]
}


interface ReducerAction {
  type: 'setOutput' | 'incrementRunning' | 'resetData'
  payload?: any
}



function reducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case 'setOutput':
      let output = undefined
      if (state?.output) {
        output = state?.output
        output[action.payload.index] = action.payload.value
      }
      return {
        ...state,
        finishedCount: state.finishedCount + 1,
        runningCount: state.runningCount - 1,
        output
      }
    case 'incrementRunning':
      return {
        ...state,
        runningCount: state.runningCount + 1,
      }
    case 'resetData':
      return {
        data: action.payload.data,
        finishedCount: 0,
        runningCount: 0,
        output: Array(action.payload.data.length).fill(undefined)
      }
  }
}


interface UseSemaphoreProps {
  data: any
  concurrency: number
  handler: (data: any) => any
}

export function useSemaphore({
  data,
  concurrency,
  handler
}: UseSemaphoreProps) {
  const [state, dispatch] = useReducer(reducer, {
    data, 
    finishedCount: 0, 
    runningCount: 0, 
    output: data ? Array(data.length).fill(undefined) : undefined,
  })

  useEffect(() => {
    if (!!data) dispatch({type: 'resetData', payload: {data}})
  }, [data])
  
  if (state.data) {
    const total = state.data.length
    if ((state.runningCount < concurrency) && (state.finishedCount + state.runningCount < total)) {
      const index = state.finishedCount + state.runningCount
      handler(state.data[index]).then((value: any) => dispatch({type: 'setOutput', payload: {index, value}}))
      dispatch({type: 'incrementRunning'})
    }
  }

  return { semaphore: state }
}
