import { useMediaQuery } from "@mui/material";
import Link from "next/link";

export default function PostEditPopup() {
    const isMobile = useMediaQuery('(max-width:550px)');
    if(isMobile) return (
        <div className="relative flex w-full justify-center z-50 bottom-16">
          <Link href={`/community/edit`} className="fixed justify-center w-[93px] px-4 py-3 flex flex-row gap-x-1 rounded-[30px] items-center bg-normal text-bold-16 text-white">
              <span>+</span>
              <span>글쓰기</span>
          </Link>
        </div>
    )
    return <></>
}