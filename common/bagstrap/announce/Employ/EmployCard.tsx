import { useCallback } from "react"
import Image from "next/image"
import clsx from "clsx"

import { AnnounceResponse } from "@generated/graphql"
import Badge from "elements/Badge"
import { IMAGE_DEFAULT_BLUR_DATA_URL } from "@constants/image.constant"
import { EmployBadgeColorType, EmployTotiKeywordColor } from "@constants/bagstrap/employBadge.constant"

const imageStyle = { objectFit: 'contain' } as const

interface EmployCardProps {
  employ: AnnounceResponse
  fullHeight?: boolean
}

function EmployCard({
  employ,
  fullHeight,
}: EmployCardProps) {

  const onClickEmployCard = useCallback(() => {
    window.open(employ.content, '_blank', "noopener, noreferrer")
  }, [employ])

  return (
    <div
      className={clsx(
        "mb-1.5",
        "cursor-pointer",
        "w-[160px] h-auto",
        "sm:flex-[0_1_30%] md:flex-[0_1_22%] flex-[0_1_45%]"
      )}
      onClick={onClickEmployCard}
    >
      <div className={clsx(
        "relative w-[100%] h-[115px] mb-1.5 rounded-lg overflow-hidden", 
        "border border-black/[.05]",
        fullHeight && "!h-[165px]",
      )}>
        <Image
          className={clsx(
            "overflow-hidden transition-transform	duration-400",
            "hover:scale-110",
          )}
          src={employ.imageUrl || IMAGE_DEFAULT_BLUR_DATA_URL}
          style={imageStyle}
          fill
          alt="employ announcement image"
          placeholder="blur"
          blurDataURL={IMAGE_DEFAULT_BLUR_DATA_URL}
        />
      </div>
      <div className="flex flex-row	gap-[3px] flex-wrap">
        { employ.labKeywords.map(labKeyword => (
          labKeyword && 
            <Badge
              key={labKeyword.code}
              content={labKeyword.name}
              color={EmployBadgeColorType[labKeyword.code as keyof typeof EmployBadgeColorType]}
            />
        ))}
        { employ.totiKeywords.map(totiKeyword => (
          totiKeyword &&
            <Badge
              key={totiKeyword.uuid}
              content={`#${totiKeyword.name}`}
              color={EmployTotiKeywordColor}
              className="!border-[#727272] !rounded-[8px] !rounded-bl-none border-[0.5px] px-1.5"
              contentClassName="!font-normal"
            />
        ))}
      </div>
      <div className={clsx(
        "text-[14px] font-semibold",
        "break-words line-clamp-2 text-ellipsis overflow-hidden",
        "mx-1 mt-1.5"
      )}>
        { employ.title }
      </div>
      <div className={clsx(
        "text-[10px] text-[#727272]",
        "whitespace-nowrap text-ellipsis overflow-hidden",
        "m-1 mt-0"
      )}>
        { employ.company }
      </div>
    </div>
  )
}

export default EmployCard
