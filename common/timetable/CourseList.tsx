import clsx from "clsx"
import { useCallback } from "react"

import { SchoolCourseEntityView } from "@generated/graphql"
import useTimeTableContext from "@hooks/context/useTimeTableContext.hook"
import CourseListItem from "./CourseListItem"

interface CourseListProp {
  
}

function CourseList({}: CourseListProp) {
  const { schoolCourses } = useTimeTableContext()

  const renderSchoolCourse = useCallback((course: SchoolCourseEntityView) => (
    <CourseListItem key={course.uuid} schoolCourse={course} />
  ), [])
  
  return (
    <div className={clsx(
      "w-full h-[calc(100vh-455px)] overflow-y-hidden overflow-y-scroll"
    )}>
      { schoolCourses.map(renderSchoolCourse)}

      {/* 테스트, infinite scroll 만들어야 함. cursor도 context로 받기. */}
    </div>
  )
}

export default CourseList
