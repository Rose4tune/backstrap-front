export default function DesktopMentoringDescriptionSection() {
  return (
    <div>
      <div className="text-bold-24 text-gray-90 text-center">
        가방끈 대학원 커피챗 멘토링을 선택하는 이유
      </div>
      <div className="text-med-14 text-gray-70 text-center mb-[32px]">
        현직 대학원 선배로부터 어디서도 얻지 못하는 인사이트를 전수받는 대학원 진학 전
        최고의 경험
      </div>
      {/* 카드 레이아웃 */}
      <div className="flex flex-col gap-[20px] px-[20px] items-center">
        <div className="flex gap-[20px]">
          {/* 1번 */}
          <div
            className="flex flex-col py-[32px] px-[28px] justify-center bg-gray-90 rounded-[20px] gap-[8px]"
            style={{ backgroundColor: '#464D57', width: '600px', height: '204px' }}
          >
            <div className="text-bold-24 text-gray-60">01</div>
            <div className="text-bold-20 text-white">
              검증된 대학원/연구실 전문 소수정예 멘토진
            </div>
            <p
              className="text-med-14 text-gray-40 whitespace-pre-line"
              style={{ color: '#E5E9F1' }}
            >
              {`타대 연구실에 진학하고 싶지만 아는 교수님 선후배가 없어 막막하셨죠,\n또 인기 랩은 학부생 인턴 자리도 없어요.\n\n이제 가방끈이 검증한 소수정예 멘토분들께 직접 여쭤보세요.`}
            </p>
          </div>
          {/* 2번 */}
          <div
            className="flex flex-col py-[32px] px-[28px] justify-center bg-gray-90 rounded-[20px] gap-[8px]"
            style={{ backgroundColor: '#464D57', width: '600px', height: '204px' }}
          >
            <div className="text-bold-24 text-gray-60">02</div>
            <div className="text-bold-20 text-white">대학원 커피챗 가이드 질문지 제공</div>
            <p
              className="text-med-14 text-gray-40 whitespace-pre-line"
              style={{ color: '#E5E9F1' }}
            >
              {`멘토링 일자 확정 이후에, 가방끈에서 자체 질문지를 전달드려요.\n까먹고 질문하지 못했던 멘토링은 이제 그만!\n물어보면 본전 뽑는 질문들을 먼저 공유해드릴게요.`}
            </p>
          </div>
        </div>
        <div className="flex gap-[20px]">
          {/* 3번 */}
          <div
            className="flex flex-col py-[32px] px-[28px] justify-center bg-gray-90 rounded-[20px] gap-[8px]"
            style={{ backgroundColor: '#464D57', width: '600px', height: '204px' }}
          >
            <div className="text-bold-24 text-gray-60">03</div>
            <div className="text-bold-20 text-white">회당 1시간으로 심도 있는 멘토링</div>
            <p
              className="text-med-14 text-gray-40 whitespace-pre-line"
              style={{ color: '#E5E9F1' }}
            >
              {`마음 속 깊은 고민을 나누기엔 15분, 30분 너무 짧아요. \n대학원 입시과정, 다양한 연구분야를 실무자에게 구체적으로 들어보세요.\n학업, 연구주제 고민부터 10년 후 커리어 고민까지 나눠보세요.`}
            </p>
          </div>
          {/* 4번 */}
          <div
            className="flex flex-col py-[32px] px-[28px] justify-center bg-gray-90 rounded-[20px] gap-[8px]"
            style={{ backgroundColor: '#464D57', width: '600px', height: '204px' }}
          >
            <div className="text-bold-24 text-gray-60">04</div>
            <div className="text-bold-20 text-white">학부생 인턴 경력이 없어도 OK</div>
            <p
              className="text-med-14 text-gray-40 whitespace-pre-line"
              style={{ color: '#E5E9F1' }}
            >
              {`대학원에 갈지 말지 고민하고 있으신 분들 환영이에요!\n연구실 인턴을 몇 개월씩 하지 않아도, 아는 대학원생 선배가 없어도 좋아요. \n가방끈 멘토들이 선배처럼 따뜻하게 진로고민의 한 줄기 빛이 되어드릴게요.`}
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
