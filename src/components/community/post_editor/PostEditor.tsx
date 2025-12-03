import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import ImageIcon from '@assets/icons/community/image_90.svg';
import VoteIcon from '@assets/icons/community/vote.svg';
import PostIcon from '@assets/icons/community/post.svg';
import CheckEmptyIcon from '@assets/icons/community/check-empty.svg';
import CheckFilledIcon from '@assets/icons/community/check-filled.svg';
import DropdownArrowIcon from '@assets/icons/community/chevron-left.svg';
import VoteComponent from './VoteComponent';
import ImageUploadComponent from './ImageUploadComponent';
// SimpleDeltaEditor 제거됨
import contentTransformer from './ContentTransformer';
import AutoLinkContentProcessor from './AutoLinkContentProcessor';
import LinkPreviewDisplay from './LinkPreviewDisplay';
import registerBoard, { RegisterBoardParams } from '../../../apis/community/registerBoard';
import editBoard, { EditBoardParams } from '../../../apis/community/editBoard';
import getBoardGroupAll from '../../../apis/community/getBoardGroupAll';
import getBoard, { GetBoardParams } from '../../../apis/community/getBoard';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { components } from 'src/types/api';
import {
  PostEditorProps,
  PostData,
  CategoryOption,
  CategoryDropdownProps,
  CheckboxProps,
  ToolbarProps,
  VoteData,
  ImageData
} from './PostEditor.types';
import { DeltaContent } from './RichTextEditor.types';
import { useMediaQuery } from '@mui/material';
import { useStore } from '@stores/useStore.hook';
import { observer } from 'mobx-react';

type BoardGroup = components['schemas']['FAGroupViewDto'];

function CategoryDropdown({ value, onChange, options }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  const isMobile = useMediaQuery('(max-width:550px)');
  return (
    <div className="relative z-30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 py-2 px-0 rounded-xl hover:bg-gray-20 transition-colors ${isMobile?'w-full justify-between text-med-14':'text-bold-16'}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-gray-90 leading-[20px]">
          {selectedOption?.label || '카테고리 선택'}
        </span>
        <div className="w-6 h-6 flex items-center justify-center">
          <DropdownArrowIcon
            className={`w-4 h-4 text-gray-50 transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-30 rounded-xl shadow-lg z-10 py-4">
          <ul role="listbox" className="flex flex-col gap-y-4 h-40 overflow-y-scroll" style={{scrollbarWidth:'none'}}>
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={value === option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 hover:bg-gray-20 transition-colors text-med-16 text-gray-90"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {checked ? (
          <CheckFilledIcon className="w-full h-full text-normal" />
        ) : (
          <CheckEmptyIcon className="w-full h-full text-gray-50" />
        )}
      </div>
      <span className={`text-semibold-14 leading-[18px] ${checked ? 'text-normal' : 'text-gray-50'}`}>
        {label}
      </span>
    </div>
  );
}


function Toolbar({ onImageClick, onVoteClick, hasImage, hasVote, mode = 'create', isImageUploading = false }: ToolbarProps) {
  const isEditMode = mode === 'edit';

  return (
    <div className={`flex items-center gap-x-[40px] py-3`}>
      <button
        type="button"
        onClick={onImageClick}
        disabled={isImageUploading}
        className={`w-6 h-6 flex items-center justify-center transition-colors ${
          isImageUploading
            ? 'opacity-30 cursor-not-allowed'
            : hasImage
              ? 'opacity-100'
              : 'opacity-60 hover:opacity-100'
        }`}
        aria-label={isImageUploading ? "이미지 업로드 중..." : "이미지 추가"}
        title={isImageUploading ? "이미지 업로드 중입니다..." : "이미지 추가"}
      >
        {isImageUploading ? (
          <div className="w-4 h-4 border-2 border-gray-50 border-t-transparent rounded-full animate-spin" />
        ) : (
          <ImageIcon className='w-5 h-5'/>
        )}
      </button>
      <button
        type="button"
        onClick={isEditMode ? undefined : onVoteClick}
        disabled={isEditMode}
        className={`w-6 h-6 flex items-center justify-center transition-colors ${
          isEditMode
            ? 'opacity-30 cursor-not-allowed'
            : hasVote
              ? 'opacity-100'
              : 'opacity-60 hover:opacity-100'
        }`}
        aria-label={isEditMode ? "투표 수정 불가" : "투표 추가"}
        title={isEditMode ? "투표는 수정 모드에서 변경할 수 없습니다" : "투표 추가"}
      >
        <VoteIcon className='w-6 h-6'/>
      </button>
    </div>
  );
}

const PostEditor = ({
  onSubmit,
  isLoading = false,
  initialData,
  boardUuid,
  mode = 'create',
  initialCategory
}: PostEditorProps) => {
  // 초기 데이터에서 이미지 추출 및 ImageData 생성
  const getInitialImagesFromDelta = (): ImageData[] => {
    if (!initialData?.content || !Array.isArray(initialData.content)) {
      return initialData?.images || [];
    }

    // AutoLinkContentProcessor를 사용해 Delta에서 이미지 URL 추출
    const imageUrls = AutoLinkContentProcessor.extractImages(initialData.content as DeltaContent);

    const deltaImages: ImageData[] = imageUrls.map((url, index) => ({
      id: `initial-delta-${index}`,
      fileUuid: undefined, // Delta에서는 fileUuid 정보가 없을 수 있음
      file: new File([], `delta-image-${index + 1}`), // 더미 파일 객체
      url: url,
      serverUrl: url,
      name: `delta-image-${index + 1}`,
      size: 0,
      uploadStatus: 'uploaded' as const,
      alt: 'Delta Image'
    }));

    // 기존 images와 합치기 (중복 제거)
    const existingImages = initialData?.images || [];
    const allImages = [...existingImages, ...deltaImages];

    // URL 기준으로 중복 제거
    return allImages.filter((image, index, self) =>
      index === self.findIndex(img => img.url === image.url)
    );
  };

  const initialImages = getInitialImagesFromDelta();

  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || '',
    content: initialData?.content || [{ insert: '' }], // 기본 Delta 구조로 초기화
    category:'',
    isAnonymous: initialData?.isAnonymous !== undefined ? initialData.isAnonymous : true,
    hasImage: initialImages.length > 0,
    hasVote: initialData?.hasVote || false,
    voteData: initialData?.voteData,
    images: initialImages,
    contentType: 'rich', // 자동 링크 감지가 있는 리치 텍스트
    contentHtml: '',
    contentText: '',
  });

  // 표시용 텍스트 상태 (실제 사용자가 보는 내용)
  const [displayText, setDisplayText] = useState<string>(() => {
    if (typeof initialData?.content === 'string') {
      return initialData.content;
    } else if (Array.isArray(initialData?.content)) {
      return AutoLinkContentProcessor.deltaToDisplayText(initialData.content as DeltaContent);
    }
    return '';
  });

  const [boardGroups, setBoardGroups] = useState<BoardGroup[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [cookies] = useCookies();
  const {UserStore} = useStore();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMediaQuery('(max-width:550px)');

  // accessToken 가져오기
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

  // 게시판 그룹 목록 가져오기
  useEffect(() => {
    const fetchBoardGroups = async () => {
      try {
        const response = await getBoardGroupAll(accessToken);
        if (response.success && response.data) {
          setBoardGroups(response.data);
          // console.log(boardGroups)
          // CategoryOption 형태로 변환
          const categoryOptions: CategoryOption[] = response.data.filter(group=>(group.writable||(group.code==='ADMIN'&&UserStore.getUser().isAdmin))).map(group => ({
            value: group.uuid || '',
            label: group.name || ''
          }));
          setCategories(categoryOptions);

          // 초기 카테고리가 없으면 첫 번째 카테고리로 설정
          // if (!formData.category && !initialCategory && categoryOptions.length > 0) {
          //   setFormData(prev => ({ ...prev, category: categoryOptions[0].value }));
          // }
          // initialCategory가 전달되었으면 해당 카테고리로 설정
          if (initialCategory && categoryOptions.some(option => option.value === initialCategory)) {
            setFormData(prev => ({ ...prev, category: initialCategory }));
          }
        }
      } catch (error) {
        console.error('게시판 그룹 목록 가져오기 실패:', error);
      }
    };

    fetchBoardGroups();
  }, [accessToken]); // accessToken이 변경될 때마다 재실행

  // 기존 게시글 로딩 (수정 모드인 경우)
  useEffect(() => {
    const loadExistingBoard = async () => {
      if (mode !== 'edit' || !boardUuid || !accessToken) {
        return;
      }

      setIsLoadingBoard(true);
      setLoadError(null);

      try {
        const response = await getBoard({ uuid: boardUuid }, accessToken);

        if (response.success && response.data) {
          const board = response.data;

          // API 콘텐츠를 Delta로 변환
          const deltaContent = contentTransformer.apiToDelta(board.content || '');
          const displayText = AutoLinkContentProcessor.deltaToDisplayText(deltaContent);

          // 이미지 파일 정보 변환 (files 배열에서)
          const existingImages: ImageData[] = (board.files || [])
            .filter(file => file.file?.uuid) // file.file.uuid가 실제 파일 UUID
            .map((file, index) => ({
              id: file.uuid || `existing-${index}`, // FA entity file UUID를 임시 ID로 사용
              fileUuid: file.file?.uuid, // 실제 파일 UUID
              file: new File([], file.description || 'image'), // 실제 파일 객체는 없으므로 더미 생성
              url: file.file?.url || '', // 서버에서 받은 파일 URL
              serverUrl: file.file?.url || '', // 실제 파일 URL
              name: file.file?.name || file.description || 'image',
              size: 0, // 크기 정보 없음
              uploadStatus: 'uploaded' as const,
              alt: file.description
            }));

          // Delta에서 이미지 URL 추출 (AutoLinkContentProcessor 사용)
          const deltaImageUrls = AutoLinkContentProcessor.extractImages(deltaContent);
          const deltaImages: ImageData[] = deltaImageUrls.map((url, index) => ({
            id: `edit-delta-${index}`,
            fileUuid: undefined,
            file: new File([], `delta-image-${index + 1}`),
            url: url,
            serverUrl: url,
            name: `delta-image-${index + 1}`,
            size: 0,
            uploadStatus: 'uploaded' as const,
            alt: 'Delta Image'
          }));

          // 모든 이미지 합치기 (중복 제거)
          const allImages = [...existingImages, ...deltaImages];
          const uniqueImages = allImages.filter((image, index, self) =>
            index === self.findIndex(img => img.url === image.url)
          );

          // 투표 데이터 변환
          let voteData: VoteData | undefined;
          if (board.vote) {
            voteData = {
              title: board.vote.title || '',
              options: (board.vote.contents || []).map((voteItem, index) => ({
                id: voteItem.uuid || (index + 1).toString(),
                text: voteItem.content || ''
              }))
            };
          }

          // 폼 데이터 설정
          setFormData({
            title: board.title || '',
            content: deltaContent,
            category: board.category?.uuid || '',
            isAnonymous: board.isAnonymous || false,
            hasImage: uniqueImages.length > 0,
            hasVote: !!board.vote,
            voteData,
            images: uniqueImages,
            contentType: 'rich',
            contentHtml: contentTransformer.deltaToHtml(deltaContent),
            contentText: contentTransformer.deltaToText(deltaContent),
          });

          // 표시용 텍스트 설정
          setDisplayText(displayText);

        } else {
          setLoadError(response.messages || '게시글을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to load board:', error);
        setLoadError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingBoard(false);
      }
    };

    loadExistingBoard();
  }, [mode, boardUuid, accessToken]);

  // UUID로 BoardGroup 찾기 함수
  const getBoardGroupByUuid = (uuid: string): BoardGroup | undefined => {
    return boardGroups.find(group => group.uuid === uuid);
  };

  // PostData를 EditBoardParams로 변환하는 함수 (수정 모드용)
  const mapPostDataToEditParams = (data: PostData): EditBoardParams => {
    // Rich Text 콘텐츠를 API 형식으로 변환 (ReactQuill 호환)
    let contentForApi: string;
    if (data.contentType === 'rich' && Array.isArray(data.content)) {
      // console.log('📝 Edit mode: Converting to ReactQuill format');
      contentTransformer.debugCompareWithQuill(data.content as DeltaContent);

      contentForApi = contentTransformer.deltaToApi(data.content as DeltaContent);
      // console.log('🚀 Edit mode: Final content for API (ReactQuill compatible):', contentForApi);
    } else {
      contentForApi = typeof data.content === 'string' ? data.content.trim() : '';
    }

    const params: EditBoardParams = {
      uuid: boardUuid || '', // 수정 모드에서는 boardUuid가 필수
      title: data.title.trim(),
      content: contentForApi,
      isAnonymous: data.isAnonymous,
      categoryUuid: data.category,
      entityStatus: 'ACTIVE',
      changeLog: '게시글 수정' // 변경 로그
    };

    return params;
  };

  // PostData를 RegisterBoardParams로 변환하는 함수
  const mapPostDataToRegisterParams = (data: PostData): RegisterBoardParams => {
    // Rich Text 콘텐츠를 API 형식으로 변환 (ReactQuill 호환)
    let contentForApi: string;
    if (data.contentType === 'rich' && Array.isArray(data.content)) {
      // 디버그 정보 출력
      contentTransformer.debugCompareWithQuill(data.content as DeltaContent);

      contentForApi = contentTransformer.deltaToApi(data.content as DeltaContent);
    } else {
      contentForApi = typeof data.content === 'string' ? data.content.trim() : '';
    }

    const params: RegisterBoardParams = {
      title: data.title.trim(),
      content: contentForApi,
      isAnonymous: data.isAnonymous,
      categoryUuid: data.category, // 이제 category 자체가 UUID입니다
      entityStatus: 'ACTIVE',
      version: 1
    };

    // 이미지는 content 내에 Delta 형식으로 포함되므로 files 배열에 별도로 추가하지 않음
    // files 배열은 문서 첨부 등 다른 용도로만 사용

    // 투표가 있는 경우
    if (data.hasVote && data.voteData) {
      const validOptions = data.voteData.options
        .filter(option => option.text.trim())
        .map(option => option.text.trim());

      params.voteRegisterDto = {
        title: data.voteData.title,
        contents: validOptions, // 투표 선택지들의 배열
        numChoice: 1, // 단일 선택 투표 (필요에 따라 조정 가능)
        entityStatus: 'ACTIVE' as const,
        // deadline은 optional이므로 필요시 추가
        // parentEntityType, parentEntityUuid는 optional이므로 생략
      };
    }

    return params;
  };

  const handleSubmit = async () => {
    // 기본 유효성 검사
    if (formData.category==='') {
      setSubmitError('카테고리를 선택해 주세요.');
      return;
    }
    if (!formData.title.trim()) {
      setSubmitError('제목을 입력해주세요.');
      return;
    }

    // 이미지 업로드 진행 중 확인
    if (isImageUploading) {
      setSubmitError('이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 이미지 업로드 실패 확인
    const hasFailedImages = formData.images?.some(img => img.uploadStatus === 'error');
    if (hasFailedImages) {
      setSubmitError('업로드에 실패한 이미지가 있습니다. 다시 업로드하거나 제거해주세요.');
      return;
    }

    // Rich Text 콘텐츠 유효성 검사
    if (formData.contentType === 'rich' && Array.isArray(formData.content)) {
      const validation = contentTransformer.validateContent(formData.content as DeltaContent);
      if (!validation.isValid) {
        setSubmitError(validation.errors[0] || '내용을 입력해주세요.');
        return;
      }
    } else if (typeof formData.content === 'string' && !formData.content.trim()) {
      setSubmitError('내용을 입력해주세요.');
      return;
    }

    // 인증 토큰 확인
    // if (!accessToken) {
    //   setSubmitError('로그인이 필요합니다.');
    //   // 로그인 페이지로 리다이렉트 (실제 경로에 맞게 수정)
    //   router.push('/user/sign-in');
    //   return;
    // }

    // 투표 유효성 검사
    if (formData.hasVote && formData.voteData) {
      const validOptions = formData.voteData.options.filter(option => option.text.trim());
      if (!formData.voteData.title.trim()) {
        setSubmitError('투표 제목을 입력해주세요.');
        return;
      }
      if (validOptions.length < 2) {
        setSubmitError('투표 선택지를 최소 2개 이상 입력해주세요.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;

      if (mode === 'edit') {
        // 수정 모드
        const editParams = mapPostDataToEditParams(formData);
        // console.log('Edit params:', JSON.stringify(editParams));
        result = await editBoard(editParams, accessToken);
      } else {
        // 등록 모드
        const registerParams = mapPostDataToRegisterParams(formData);
        // console.log('Register params:', JSON.stringify(formData));
        result = await registerBoard(registerParams, accessToken);
      }

      if (result.success) {
        // 기존 onSubmit prop 호출 (상위 컴포넌트에서 추가 처리가 필요한 경우)
        onSubmit?.(formData);

        // // 성공 시 게시글 상세 페이지로 이동
        if (result.data?.uuid) {
          router.push(`/community/post/${result.data.uuid}`);
        } else {
          // UUID가 없는 경우 커뮤니티 메인으로 이동
          router.push('/community');
        }
      } else {
        const errorMessage = mode === 'edit' ? '게시글 수정에 실패했습니다.' : '게시글 등록에 실패했습니다.';
        setSubmitError(result.messages || errorMessage);
      }
    } catch (error) {
      console.error(`게시글 ${mode === 'edit' ? '수정' : '등록'} 중 오류 발생:`, error);
      setSubmitError('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    // 에러 상태 초기화
    if (submitError) setSubmitError(null);
  };

  // textarea 높이 자동 조절 함수
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // 초기 값 또는 displayText 변경 시 높이 조절
  useEffect(() => {
    if (textareaRef.current && displayText) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [displayText]);

  // 자동 링크 감지가 있는 콘텐츠 변경 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setDisplayText(newText);

    // 자동 링크 감지 및 Delta 변환
    const textDelta = AutoLinkContentProcessor.textToDelta(newText);

    setFormData(prev => {
      // console.log('📝 handleContentChange - preserving existing images:', prev.images?.length || 0);

      // 기존 이미지들을 Delta 형태로 변환 (업로드 완료된 것만)
      const existingImageOps: DeltaContent = [];
      if (prev.images && prev.images.length > 0) {
        const uploadedImages = prev.images.filter(img =>
          img.uploadStatus === 'uploaded' && img.serverUrl
        );

        uploadedImages.forEach((img) => {
          const imageOp = {
            insert: { image: img.serverUrl! },
            attributes: img.alt ? { alt: img.alt } : undefined
          };
          existingImageOps.push(imageOp);
        });
      }

      // 새로운 Delta 콘텐츠 구성: 텍스트 + 기존 이미지들
      const combinedDelta: DeltaContent = [...textDelta, ...existingImageOps];

      const html = contentTransformer.deltaToHtml(combinedDelta);
      const plainText = contentTransformer.deltaToText(combinedDelta);

      return {
        ...prev,
        content: combinedDelta,
        contentHtml: html,
        contentText: plainText,
        hasImage: Boolean(prev.images && prev.images.length > 0),
      };
    });

    // 에러 상태 초기화
    if (submitError) setSubmitError(null);
  };

  // 이미지 업로드 핸들러 (Rich Text Editor용) - 사용 안 함 (ImageUploadComponent에서 처리)
  const handleImageUpload = async (file: File): Promise<string> => {
    // 이 함수는 더 이상 사용되지 않습니다
    // ImageUploadComponent에서 실제 파일 업로드를 처리합니다
    return URL.createObjectURL(file);
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleAnonymousChange = (isAnonymous: boolean) => {
    setFormData(prev => ({ ...prev, isAnonymous }));
  };

  const handleImageToggle = () => {
    setFormData(prev => ({ ...prev, hasImage: !prev.hasImage }));
  };

  const handleImageDataChange = (images: ImageData[]) => {
    // console.log('🖼️ handleImageDataChange called with images:', images.length, images);

    // 이미지 업로드 상태 추적
    const hasUploadingImages = images.some(img => img.uploadStatus === 'uploading');
    setIsImageUploading(hasUploadingImages);

    setFormData(prev => {
      // console.log('📝 Current formData content type:', prev.contentType, 'content:', prev.content);
      try {
        let updatedContent = prev.content;

        // Rich Text 모드에서 Delta 콘텐츠를 이미지 배열과 완전히 동기화
        if (prev.contentType === 'rich') {
          // Delta content가 없거나 빈 배열인 경우 기본 구조 초기화
          const currentContent = Array.isArray(prev.content) ? prev.content as DeltaContent : [];

          // 1. 기존 Delta에서 텍스트 내용만 추출 (이미지 제외)
          const textOnlyContent = currentContent.filter(op => {
            // 이미지가 아닌 모든 content 유지
            return !(op.insert && typeof op.insert === 'object' && 'image' in op.insert);
          });

          // 2. 업로드 완료된 모든 이미지를 Delta 형태로 변환
          const uploadedImages = images.filter(img =>
            img.uploadStatus === 'uploaded' && img.serverUrl
          );

          console.log('🔍 Filtering images - total:', images.length, 'uploaded:', uploadedImages.length);
          console.log('📋 Image statuses:', images.map(img => ({ id: img.id, status: img.uploadStatus, hasServerUrl: !!img.serverUrl })));

          // 3. 새로운 Delta 콘텐츠 구성
          let deltaContent: DeltaContent = [];

          // 텍스트가 있으면 먼저 추가
          if (textOnlyContent.length > 0) {
            deltaContent = [...textOnlyContent];
          } else if (uploadedImages.length > 0 && currentContent.length === 0) {
            // 텍스트가 없고 이미지만 있는 경우 기본 텍스트 노드 추가
            deltaContent = [{ insert: '' }];
          }

          // 모든 업로드된 이미지 추가
          uploadedImages.forEach((img) => {
            const imageOp = {
              insert: { image: img.serverUrl! },
              attributes: img.alt ? { alt: img.alt } : undefined
            };

            deltaContent.push(imageOp);
          });

          // 빈 content인 경우 최소한의 구조 보장
          if (deltaContent.length === 0) {
            deltaContent = [{ insert: '' }];
          }

          updatedContent = deltaContent;

          // HTML과 텍스트 버전도 업데이트
          const html = contentTransformer.deltaToHtml(deltaContent);
          const plainText = contentTransformer.deltaToText(deltaContent);

          return {
            ...prev,
            images,
            content: deltaContent,
            contentHtml: html,
            contentText: plainText,
            hasImage: images.length > 0,
          };
        }

        // Rich Text 모드가 아닌 경우 기본 처리
        return { ...prev, images, hasImage: images.length > 0 };

      } catch (error) {
        console.error('이미지 데이터 변경 중 오류 발생:', error);

        // 에러 발생 시 롤백: 이미지 상태만 업데이트하고 content는 유지
        return {
          ...prev,
          images: images.filter(img => img.uploadStatus !== 'error'), // 에러 상태 이미지 제거
          hasImage: images.filter(img => img.uploadStatus !== 'error').length > 0,
        };
      }
    });

    // 업로드 완료된 이미지들의 UUID 수집
    const uploadedFiles = images
      .filter(img => img.uploadStatus === 'uploaded' && img.fileUuid)
      .map((img, index) => ({
        fileUuid: img.fileUuid!,
        displayOrder: index + 1,
        description: img.name
      }));

    // console.log('Uploaded files for API:', uploadedFiles);
  };

  const handleVoteToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasVote: !prev.hasVote,
      voteData: !prev.hasVote ? { title: '', options: [{ id: '1', text: '' }, { id: '2', text: '' }] } : prev.voteData
    }));
  };

  const handleVoteDataChange = (voteData: VoteData) => {
    setFormData(prev => ({ ...prev, voteData }));
    // 투표 관련 에러 상태 초기화
    if (submitError) setSubmitError(null);
  };

  // 로딩 중인 경우 로딩 스피너 표시
  if (isLoadingBoard) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-white p-8">
        <img src="/assets/loading.gif" alt="로딩" className="w-8 h-8 mb-4" />
        <span className="text-med-16 text-gray-70">게시글을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full bg-white">
      <div className="flex flex-col gap-4 p-0">
        {/* 로딩 에러 메시지 표시 */}
        {loadError && (
          <div className="bg-red-10 border border-red-50 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <span className="text-med-14 text-red">⚠️ {loadError}</span>
            </div>
          </div>
        )}

        {/* 에러 메시지 표시 */}
        {submitError && (
          <div className="bg-red-10 border border-red-50 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <span className="text-med-14 text-red">⚠️ {submitError}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4">
          <CategoryDropdown
            value={formData.category}
            onChange={handleCategoryChange}
            options={categories}
          />

          {/* Title Input */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="제목을 입력해주세요"
              className="text-bold-24 text-gray-90 placeholder-gray-300 leading-[32px] tracking-[-0.48px] bg-transparent border-none outline-none w-full"
              autoFocus
            />

            {/* Divider */}
            <div className="h-px bg-gray-30 w-full" />

            {/* Auto-Link Content Input with Overlay */}
            <div className="relative">
              {/* 실제 입력 textarea */}
              <textarea
                ref={textareaRef}
                value={displayText}
                onChange={handleContentChange}
                placeholder={`타학교 대학원생들과 소통해보세요!\n#논문 #진로 #연구고민`}
                className="text-med-16 leading-[22px] tracking-[0.0912px] bg-transparent border-none outline-none placeholder-gray-300 resize-none min-h-[300px] w-full relative z-0"
                rows={6}
                maxLength={10000}
                style={{
                  background: 'transparent',
                  color: 'transparent', // 텍스트를 투명하게 하여 오버레이가 보이도록
                  caretColor: '#374151', // 커서는 보이게
                  height: 'auto',
                  minHeight: '300px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  adjustTextareaHeight(target);
                }}
              />

              {/* 하이퍼링크 오버레이 */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                <LinkPreviewDisplay
                  text={displayText}
                  className="text-med-16 leading-[22px] tracking-[0.0912px] min-h-[120px] p-0 whitespace-pre-wrap overflow-hidden"
                />
              </div>
            </div>

            {/* 글자 수 카운터 */}
            {/* <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
              <div className={`text-sm ${displayText.length > 10000 ? 'text-red-500' : 'text-gray-500'}`}>
                {displayText.length} / 10,000자
              </div>
            </div> */}
          </div>
        </div>

        {/* Vote Component */}
        {formData.hasVote && (
          <div className='w-full max-w-[600px]'>
            <VoteComponent
              isVisible={formData.hasVote}
              onClose={mode === 'edit' ? undefined : () => setFormData(prev => ({ ...prev, hasVote: false }))}
              onChange={mode === 'edit' ? undefined : handleVoteDataChange}
              initialData={formData.voteData}
              readOnly={mode === 'edit'}
            />
          </div>
        )}

        {/* Image Upload Component */}
        {formData.hasImage && (
          <ImageUploadComponent
            isVisible={formData.hasImage}
            onClose={() => setFormData(prev => ({ ...prev, hasImage: false }))}
            onChange={handleImageDataChange}
            initialImages={formData.images}
            accessToken={accessToken}
          />
        )}

        {/* Toolbar & Controls */}
        <div className={`flex items-center justify-between pt-3 m:pt-20 ${isMobile&&'fixed bottom-0 w-full bg-white z-[2147483648] pb-3 pr-10'}`}>
          <Toolbar
            onImageClick={handleImageToggle}
            onVoteClick={handleVoteToggle}
            hasImage={formData.hasImage}
            hasVote={formData.hasVote}
            mode={mode}
            isImageUploading={isImageUploading}
          />

          <div className="flex items-center gap-8">
            <Checkbox
              checked={formData.isAnonymous}
              onChange={handleAnonymousChange}
              label="익명"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || isImageUploading}
              className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
              aria-label="게시글 작성"
              title="게시글 작성"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-gray-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <PostIcon className={`w-full h-full transition-colors ${(formData.category!=='' && formData.title!=='' && formData.contentText!=='')?'text-normal':'text-gray-50'}`}/>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Advertisement Area */}
      {/* <div className="bg-gray-90 h-[116px] rounded-2xl flex items-center justify-center mt-auto">
        <div className="text-center">
          <div className="text-bold-16 text-white leading-[20px] mb-0">
            외부 광고 F
          </div>
          <div className="text-bold-16 text-white leading-[20px]">
            광고 영역은 940x116px 입니다
          </div>
        </div>
      </div> */}
    </div>
  );
}
export default observer(PostEditor);