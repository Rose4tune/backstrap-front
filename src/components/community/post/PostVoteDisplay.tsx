import React, { useState } from 'react';
import { components } from 'src/types/api';
import voteAction from '../../../apis/community/editVote';
import { useRouter } from 'next/navigation';
import CheckIcon from '@assets/icons/community/check.svg';
import VerificationRequiredPopup from 'src/components/common/VerificationRequiredPopup';

// API 스키마에서 타입 가져오기
type VoteEntityView = components['schemas']['VoteEntityView'];
type VoteItemEntityView = components['schemas']['VoteItemEntityView'];

// 투표 데이터 인터페이스 (API 스키마 기반)
interface VoteData {
  contents?: VoteItemEntityView[];
  title?: string;
  numChoice?: number;
  isDone?: boolean;
  deadline?: string | null;
  numParticipant?: number;
  uuid?: string;
  entityStatus?: string;
  createdDate?: string;
  elapsedCreatedDate?: string;
}

interface PostVoteDisplayProps {
  vote: VoteData;
  onVote?: (optionUuids: string[]) => void;
  accessToken?: string;
  className?: string;
}

export default function PostVoteDisplay({ vote, onVote, accessToken, className = '' }: PostVoteDisplayProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    vote.contents?.filter(content => content.isVoted).map(content => content.uuid || '') || []
  );
  const [hasVoted, setHasVoted] = useState(
    vote.contents?.some(content => content.isVoted) || false
  );
  const [isVoting, setIsVoting] = useState(false);
  const [viewingResults, setViewingResults] = useState(false);
  const [originalVotedOptions, setOriginalVotedOptions] = useState<string[]>(
    vote.contents?.filter(content => content.isVoted).map(content => content.uuid || '') || []
  );
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const router = useRouter();
  // 총 투표 수 계산
  const totalVotes = vote.contents?.reduce((sum, content) => sum + (content.numVote || 0), 0) || 0;

  // 투표 변경 여부 확인
  const hasChanges = hasVoted && JSON.stringify(selectedOptions.sort()) !== JSON.stringify(originalVotedOptions.sort());

  // 가장 많은 득표 수 확인

  const maxVotedNum = vote.contents?.reduce((max, current) => {
    if ((current.numVote ?? 0) > (max.numVote ?? 0)) {
      return current;
    }
    return max;
  }, vote.contents[0]).numVote;

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionUuid: string) => {
    if (vote.isDone || isVoting || viewingResults) return; // 투표 완료되었거나 투표 중이거나 결과 보기 중인 경우 return

    let newSelectedOptions: string[];
    const numChoice = vote.numChoice || 1;

    if (numChoice === 1) {
      // 단일 선택 - 같은 옵션 클릭 시 해제
      if (selectedOptions.includes(optionUuid)) {
        newSelectedOptions = [];
      } else {
        newSelectedOptions = [optionUuid];
      }
    } else {
      // 다중 선택
      if (selectedOptions.includes(optionUuid)) {
        newSelectedOptions = selectedOptions.filter(uuid => uuid !== optionUuid);
      } else {
        if (selectedOptions.length < numChoice) {
          newSelectedOptions = [...selectedOptions, optionUuid];
        } else {
          return; // 최대 선택 수 초과
        }
      }
    }

    setSelectedOptions(newSelectedOptions);
  };

  // 투표 제출 핸들러
  const handleSubmitVote = async () => {
    if (!vote.uuid || isVoting) return;
    if (!accessToken) {
      setShowVerificationPopup(true);
      return;
    }
    setIsVoting(true);

    try {
      const result = await voteAction({
        uuid: vote.uuid,
        selectedContentUuids: selectedOptions
      }, accessToken);

      if (result.success) {
        setHasVoted(true);
        setViewingResults(false); // 투표 완료 시 결과 보기 모드 해제
        setOriginalVotedOptions(selectedOptions); // 새로운 투표 선택을 원본으로 저장
        onVote?.(selectedOptions);
        console.log('투표 성공:', result.data);
      } else {
        console.error('투표 실패:', result.messages);
        alert(result.messages || '투표에 실패했습니다.');
      }
    } catch (error) {
      console.error('투표 오류:', error);
      alert('투표 중 오류가 발생했습니다.');
    } finally {
      setIsVoting(false);
      router.refresh();
    }
  };

  // 결과 보기 핸들러
  const handleViewResults = () => {
    setViewingResults(true);
    setSelectedOptions([]); // 선택 초기화
  };

  // 투표하러 가기 핸들러
  const handleBackToVoting = () => {
    setViewingResults(false);
    setSelectedOptions([]);
  };

  // 투표율 계산
  const getVotePercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };
  return (
    <>
      <VerificationRequiredPopup
        onClick={()=>router.push('/user/sign-in')}
        isOpen={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
        title={"로그인 필요"}
        description={"투표를 위해서는 로그인이 필요합니다."}
        actionText={"로그인하기"}
      />
      <div className={`border-[1px] border-gray-20 rounded-xl p-[18px] mt-4 ${className}`}>
        {/* 투표 제목 및 참여자 수 */}
        <div className="mb-4">
          <h3 className="text-med-16 text-gray-70 leading-[22px] tracking-[0.0912px] mb-1">
            {vote.title || '투표'}
          </h3>
          <p className="text-med-12 text-gray-50 leading-[16px]">
            {vote.numParticipant || 0}명 참여
            {(vote.numChoice || 1) > 1 && ` • 최대 ${vote.numChoice}개 선택 가능`}
            {vote.isDone && ' • 투표 종료'}
          </p>
        </div>

        {/* 투표 옵션들 */}
        <div className="space-y-3 mb-4">
          {vote.contents?.map((option) => {
            const optionUuid = option.uuid || '';
            const isSelected = selectedOptions.includes(optionUuid);
            const isOriginallyVoted = originalVotedOptions.includes(optionUuid);
            const isOptionVoted = option.isVoted || false;
            const votePercentage = getVotePercentage(option.numVote || 0);
            const showResults = hasVoted || vote.isDone || viewingResults;
            const isMaxNum = option.numVote === maxVotedNum;

            return (
              <div
                key={optionUuid}
                className={`relative rounded-xl p-3 transition-all ${
                  'bg-gray-20 hover:bg-gray-30' // 선택 안한 항목 (해제된 항목도 동일)
                } ${vote.isDone || viewingResults ? 'cursor-default' : 'cursor-pointer'} ${isVoting ? 'opacity-50 cursor-wait' : ''}`}
                onClick={() => handleOptionSelect(optionUuid)}
              >
                {/* 진행 바 (결과 표시 시) */}
                {showResults && (
                  <div
                    className="absolute inset-0 bg-bagstrap-30 rounded-xl transition-all"
                    style={{ width: `${votePercentage}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* 선택 표시 */}
                    { ((isSelected && !vote.isDone && !viewingResults)) &&
                      <CheckIcon className='w-5 h-5 text-click'/>
                    }
                    {/* <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      (isSelected && !vote.isDone && !viewingResults) || (showResults && isOptionVoted && vote.isDone)
                        ? 'border-normal bg-normal'
                        : 'border-gray-40'
                    }`}>
                      {((isSelected && !vote.isDone && !viewingResults) || (showResults && isOptionVoted)) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div> */}

                    {/* 옵션 텍스트 */}
                    <div className="flex-1">
                      <span className={`text-med-14 ${showResults? 'text-click':'text-gray-90'} leading-[18px]`}>
                        {option.content || '투표 항목'}
                      </span>
                    </div>
                  </div>

                  {/* 투표 수 및 비율 (결과 표시 시) */}
                  {showResults && (
                    <div className="flex items-center gap-2">
                      <span className={`text-med-12 ${isMaxNum?'text-gray-70':'text-gray-50'}`}>
                        {option.numVote || 0}표
                      </span>
                      <span className={`text-bold-12 ${isMaxNum?'text-gray-70':'text-gray-50'} min-w-[32px] text-right`}>
                        {votePercentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 투표 버튼 및 결과 보기 버튼 */}
        {!vote.isDone && (
          <div className="space-y-2">
            {!hasVoted && !viewingResults ? (
              <>
                {/* 투표하기 버튼 */}
                <button
                  onClick={handleSubmitVote}
                  disabled={selectedOptions.length === 0 || isVoting}
                  className={`w-full py-3 rounded-xl text-med-14 font-medium transition-colors ${
                    selectedOptions.length > 0 && !isVoting
                      ? 'bg-normal text-white hover:bg-opacity-90'
                      : 'bg-gray-20 text-gray-40 cursor-not-allowed'
                  }`}
                >
                  {isVoting ? '투표 중...' : '투표하기'}
                  {(vote.numChoice || 1) > 1 && selectedOptions.length > 0 && ` (${selectedOptions.length}/${vote.numChoice})`}
                </button>

                {/* 결과 보기 버튼 */}
                <button
                  onClick={handleViewResults}
                  className="w-full py-3 rounded-xl text-med-14 font-medium border border-gray-40 text-gray-70 hover:bg-gray-20 transition-colors"
                >
                  투표 없이 결과 보기
                </button>
              </>
            ) : !hasVoted && viewingResults ? (
              /* 투표하러 가기 버튼 (결과 보기 중일 때) */
              <button
                onClick={handleBackToVoting}
                className="w-full py-3 rounded-xl text-med-14 font-medium bg-normal text-white hover:bg-opacity-90 transition-colors"
              >
                투표하러 가기
              </button>
            ) : hasVoted && hasChanges ? (
              /* 투표 수정 제출 버튼 */
              <button
                onClick={handleSubmitVote}
                disabled={isVoting}
                className={`w-full py-3 rounded-xl text-med-14 font-medium transition-colors ${
                  !isVoting
                    ? 'bg-normal text-white hover:bg-opacity-90'
                    : 'bg-gray-20 text-gray-40 cursor-not-allowed'
                }`}
              >
                {isVoting ? '제출하는 중...' : '제출하기'}
                {(vote.numChoice || 1) > 1 && selectedOptions.length > 0 && ` (${selectedOptions.length}/${vote.numChoice})`}
              </button>
            ) : null}
          </div>
        )}

        {/* 상태 메시지 */}
        {viewingResults && !hasVoted && !vote.isDone && (
          <div className="text-center py-2">
            <span className="text-med-12 text-gray-60">결과 보기 모드 • 투표하지 않음</span>
          </div>
        )}

        {/* 투표 완료 메시지 */}
        {hasVoted && !vote.isDone && !hasChanges && (
          <div className="text-center py-2">
            <span className="text-med-12 text-normal">투표 완료 • 옵션을 클릭하여 투표를 수정할 수 있습니다</span>
          </div>
        )}

        {/* 투표 수정 안내 메시지 */}
        {hasVoted && hasChanges && !isVoting && (
          <div className="flex flex-wrap text-center py-2 justify-center">
            <span className="text-med-12 text-normal flex-shrink-0">투표 수정 사항이 있습니다</span>
            <span className="text-med-12 text-normal flex-shrink-0">• 제출 버튼을 눌러 변경사항을 저장하세요</span>
          </div>
        )}

        {/* 투표 수정 중 메시지 */}
        {isVoting && hasVoted && (
          <div className="text-center py-2">
            <span className="text-med-12 text-orange-500">투표 수정 중...</span>
          </div>
        )}

        {/* 투표 종료 메시지 */}
        {vote.isDone && (
          <div className="text-center py-2">
            <span className="text-med-12 text-gray-50">투표가 종료되었습니다</span>
          </div>
        )}

        {/* 마감일 표시 (있는 경우) */}
        {vote.deadline && !vote.isDone && (
          <div className="text-center mt-2">
            <span className="text-med-12 text-gray-50">
              마감: {new Date(vote.deadline).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </>
  );
}