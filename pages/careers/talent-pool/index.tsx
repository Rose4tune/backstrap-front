import PageLayout from '@layouts/PageLayout';
import CareerPageLayout from '@layouts/CareerPageLayout';

import CommonButton from '@common/button/CommonButton';

import {
  TalentPoolPageContainer,
  TalentPoolPageTitle,
  TalentPoolPageBannerContainer,
  TalentPoolPageBannerMainText,
  TalentPoolPageBannerSubText,
  TalentPoolPageBannerSubTextBr,
  TalentPoolPageAboutContainer,
  TalentPoolPageAboutItemContainer,
  TalentPoolPageAboutTitle,
  TalentPoolPageAboutAnswerContainer,
  TalentPoolPageAboutAnswer,
  TalentPoolPageAboutAnswerBold,
  TalentPoolPageAboutBr
} from '@styles/pages/careers/talent-pool/index.style';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const TalentPoolPage = () => {
  const handleClickButton = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  const isMobile = useMediaQuery('(max-width:550px)');

  return (
    isMobile ? <PageLayout>
      < CareerPageLayout >
        <TalentPoolPageContainer>
          <TalentPoolPageTitle>인재풀 등록</TalentPoolPageTitle>
          <TalentPoolPageBannerContainer>
            <TalentPoolPageBannerMainText>
              가방끈 인재풀은 준비 중입니다 :)
            </TalentPoolPageBannerMainText>
            <TalentPoolPageBannerSubText>
              기업 / 연구소에서 먼저 컨택받는 <TalentPoolPageBannerSubTextBr />
              가방끈 인재풀을 미리 만나보세요!
            </TalentPoolPageBannerSubText>
            <CommonButton
              text="1분만에 인재풀 사전신청하기 →"
              size="lg"
              emphasis="primary"
              onClick={handleClickButton}
            />
          </TalentPoolPageBannerContainer>
          <TalentPoolPageAboutContainer>
            <TalentPoolPageAboutItemContainer>
              <TalentPoolPageAboutTitle>
                📌
                <TalentPoolPageAboutBr />
                가방끈 인재풀이 <TalentPoolPageAboutBr />
                무엇인가요?
              </TalentPoolPageAboutTitle>
              <TalentPoolPageAboutAnswerContainer>
                <TalentPoolPageAboutAnswer>
                  가방끈 인재풀이란 구직자가 자신의 정보를 등록해두면,{' '}
                  <TalentPoolPageAboutBr />
                  기업/연구소 등에서 인재에게 먼저 연락할 수 있는 시스템입니다.
                </TalentPoolPageAboutAnswer>
                <TalentPoolPageAboutAnswer>
                  채용 공고가 올라올 시기를 기다리지 않아도 되며,{' '}
                  <TalentPoolPageAboutBr />
                  나와 맞는 직무가 생기면 기업/연구소에서 먼저 연락을 받을 수도 있어요.
                </TalentPoolPageAboutAnswer>
                <TalentPoolPageAboutAnswer>
                  현재 적극적으로 구직하고 있지 않더라도, <TalentPoolPageAboutBr />
                  추후 기업/연구소에서 연락을 받을 기회를 얻을 수 있으니 꼭 등록해보세요!
                </TalentPoolPageAboutAnswer>
              </TalentPoolPageAboutAnswerContainer>
            </TalentPoolPageAboutItemContainer>
            <TalentPoolPageAboutItemContainer>
              <TalentPoolPageAboutTitle>
                📄
                <TalentPoolPageAboutBr />
                가방끈 인재풀은 <TalentPoolPageAboutBr />
                어떻게 등록하나요?
              </TalentPoolPageAboutTitle>
              <TalentPoolPageAboutAnswerContainer>
                <TalentPoolPageAboutAnswerBold>
                  사전 신청 폼을 제출해주세요!
                </TalentPoolPageAboutAnswerBold>
                <TalentPoolPageAboutAnswer>
                  사전 신청자에 한해서 가방끈 인재풀 개발이 완료되면, 가장 먼저
                  등록해드립니다. <TalentPoolPageAboutBr />
                  지금 바로 사전 신청하고, 더 많은 기회를 만들어 보세요!
                </TalentPoolPageAboutAnswer>
              </TalentPoolPageAboutAnswerContainer>
            </TalentPoolPageAboutItemContainer>
          </TalentPoolPageAboutContainer>
        </TalentPoolPageContainer>
      </CareerPageLayout >
    </PageLayout > :
      <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
        <GlobalHeader />
        < CareerPageLayout >
          <TalentPoolPageContainer>
            <TalentPoolPageTitle>인재풀 등록</TalentPoolPageTitle>
            <TalentPoolPageBannerContainer>
              <TalentPoolPageBannerMainText>
                가방끈 인재풀은 준비 중입니다 :)
              </TalentPoolPageBannerMainText>
              <TalentPoolPageBannerSubText>
                기업 / 연구소에서 먼저 컨택받는 <TalentPoolPageBannerSubTextBr />
                가방끈 인재풀을 미리 만나보세요!
              </TalentPoolPageBannerSubText>
              <CommonButton
                text="1분만에 인재풀 사전신청하기 →"
                size="lg"
                emphasis="primary"
                onClick={handleClickButton}
              />
            </TalentPoolPageBannerContainer>
            <TalentPoolPageAboutContainer>
              <TalentPoolPageAboutItemContainer>
                <TalentPoolPageAboutTitle>
                  📌
                  <TalentPoolPageAboutBr />
                  가방끈 인재풀이 <TalentPoolPageAboutBr />
                  무엇인가요?
                </TalentPoolPageAboutTitle>
                <TalentPoolPageAboutAnswerContainer>
                  <TalentPoolPageAboutAnswer>
                    가방끈 인재풀이란 구직자가 자신의 정보를 등록해두면,{' '}
                    <TalentPoolPageAboutBr />
                    기업/연구소 등에서 인재에게 먼저 연락할 수 있는 시스템입니다.
                  </TalentPoolPageAboutAnswer>
                  <TalentPoolPageAboutAnswer>
                    채용 공고가 올라올 시기를 기다리지 않아도 되며,{' '}
                    <TalentPoolPageAboutBr />
                    나와 맞는 직무가 생기면 기업/연구소에서 먼저 연락을 받을 수도 있어요.
                  </TalentPoolPageAboutAnswer>
                  <TalentPoolPageAboutAnswer>
                    현재 적극적으로 구직하고 있지 않더라도, <TalentPoolPageAboutBr />
                    추후 기업/연구소에서 연락을 받을 기회를 얻을 수 있으니 꼭 등록해보세요!
                  </TalentPoolPageAboutAnswer>
                </TalentPoolPageAboutAnswerContainer>
              </TalentPoolPageAboutItemContainer>
              <TalentPoolPageAboutItemContainer>
                <TalentPoolPageAboutTitle>
                  📄
                  <TalentPoolPageAboutBr />
                  가방끈 인재풀은 <TalentPoolPageAboutBr />
                  어떻게 등록하나요?
                </TalentPoolPageAboutTitle>
                <TalentPoolPageAboutAnswerContainer>
                  <TalentPoolPageAboutAnswerBold>
                    사전 신청 폼을 제출해주세요!
                  </TalentPoolPageAboutAnswerBold>
                  <TalentPoolPageAboutAnswer>
                    사전 신청자에 한해서 가방끈 인재풀 개발이 완료되면, 가장 먼저
                    등록해드립니다. <TalentPoolPageAboutBr />
                    지금 바로 사전 신청하고, 더 많은 기회를 만들어 보세요!
                  </TalentPoolPageAboutAnswer>
                </TalentPoolPageAboutAnswerContainer>
              </TalentPoolPageAboutItemContainer>
            </TalentPoolPageAboutContainer>
          </TalentPoolPageContainer>
        </CareerPageLayout >
        <Footer />
      </div>

  );
};

export default TalentPoolPage;
