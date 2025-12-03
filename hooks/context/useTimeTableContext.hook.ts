import { useContext } from "react"	

import { TimeTableContext } from "@contexts/timetable.context"	

export default function useTimeTableContext() {	
  const value = useContext(TimeTableContext)	
  if (value === undefined) {	
    throw new Error('useTimeTableContext should be used within <TimeTableContext.Provider>')	
  }	
  return value	
}	
