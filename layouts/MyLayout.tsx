import Footer from "elements/Footer";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import NavigationHeader from "src/components/header/NavigationHeader";
import MyPageNavigator from "src/components/mypage/MyPageNavigator";

const MyLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <div className="bg-white">
      <NavigationHeader showBottom={false}/>
      <div className="px-20 4xl:px-60 pt-7 pb-10 w-full min-h-screen bg-gray-20 flex flex-row gap-x-[60px]">
        <div className="w-[360px] min-w-[230px]">
          <MyPageNavigator href={router.pathname}/>
        </div>
        <main className="flex flex-shrink-0 flex-col gap-y-8 p-10 rounded-[16px] bg-white w-[1020px]">
          {children}
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default MyLayout;
