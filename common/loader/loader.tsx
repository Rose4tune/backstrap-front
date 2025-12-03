import React from "react";
import clsx from 'clsx'

export interface LoaderProps {
  loading?: boolean

  loaderClassName?: string

  containerClassName?: string
}

const Loader = ({
  loading = false,
  loaderClassName,
  containerClassName
}: LoaderProps): JSX.Element => {
  
  if(!loading) return <></>

  return (
    <div
      className={clsx(
        "flex-center flex-col gap-4 opacity-50 mt-4",
        "lg:top-40",
        containerClassName,
      )}
    >
      <img src="/images/loading.gif" className={clsx(
        "w-[56px]",
        "lg:w-[96px]",
        "xl:w-[136px]",
        loaderClassName,
        )} />
      <p className={clsx("text-[#BFBFBF] text-sm", "md:text-base")}>
        로딩 중
      </p>
    </div>
  )
}

export default Loader
