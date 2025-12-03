import { useEffect, useState } from 'react';
import TextField from '@common/input/TextField';
import { Dispatch } from 'react';
import DropdownInput from '@common/input/DropdownInput';
import SchoolDropDownSearchInput from './SchoolDropDownSearchInput';
import DepartmentDropDownSearchInput from './DepartmentDropDownSearchInput';
import FileUploadForm from '@common/form/FileUploadForm';
import { userSignupStore } from '@stores/useSignupStore';
import { StudentType, studentTypeMap } from '@dto/UserRegisterDTO';

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

interface UploadedFileInfo {
  description: string;
  displayOrder: number;
  fileType: 'MENTOR_CERTIFICATE' | 'SCHOOL_CERTIFICATE';
  fileUuid: string;
}
interface UserEducationInfoInterface {
  setButtonStatus: Dispatch<React.SetStateAction<ButtonStatusType>>;
}

const SESSION_KEY = 'signup-education-info';

export default function UserEducationInfo({
  setButtonStatus
}: UserEducationInfoInterface) {
  // 상태 정의
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [degree, setDegree] = useState<string>('');
  const [admissionYear, setAdmissionYear] = useState<string>('');
  const [lab, setLab] = useState('');
  const [research, setResearch] = useState('');
  const [fileUpload, setFileUpload] = useState<UploadedFileInfo | null>(null);

  // userSignupStore 업데이트
  useEffect(() => {
    userSignupStore.update({
      studentType: studentTypeMap[degree],
      admissionYear: Number(admissionYear),
      schoolName: school,
      major: department,
      labName: lab,
      labResearchTopic: research,
      files: fileUpload
        ? [
          {
            description: fileUpload.description,
            displayOrder: fileUpload.displayOrder,
            fileType: fileUpload.fileType,
            fileUuid: fileUpload.fileUuid
          }
        ]
        : []
    });
  }, [school, department, lab, research, degree, admissionYear, fileUpload]);

  // 버튼 활성화 조건
  useEffect(() => {
    const isValid =
      school && department && lab && research && fileUpload && admissionYear && degree;

    setButtonStatus(isValid ? 'active' : 'disable');
  }, [school, department, lab, research, degree, admissionYear, fileUpload]);

  //SESSION에서 값 불러오기
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSchool(parsed.school || '');
      setDepartment(parsed.department || '');
      setAdmissionYear(parsed.admissionYear || '');
      setDegree(parsed.degree || '');
      setLab(parsed.lab || '');
      setResearch(parsed.research || '');
    }
  }, [setSchool, setDepartment, setAdmissionYear, setDegree, setLab, setResearch]);

  //SESSION에서 하나라도 값이 있으면 불러오기
  useEffect(() => {
    if (school || department || lab || research || admissionYear || degree) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          school,
          department,
          lab,
          research,
          admissionYear,
          degree
        })
      );
    }
  }, [school, department, lab, research, admissionYear, degree]);

  return (
    <div className="flex flex-col gap-[24px] pb-[173px]">
      <DropdownInput
        placeholder="학위 과정을 선택해주세요"
        options={['학사', '석사', '박사', '포닥', '교수']}
        title="학위과정"
        onChange={val => setDegree(val)}
        value={degree}
      />
      <DropdownInput
        placeholder="입학년도를 선택해주세요"
        options={Array.from({ length: 2025 - 1950 + 1 }, (_, i) => String(2025 - i))}
        title="입학년도 (학번)"
        onChange={val => setAdmissionYear(val)}
        value={admissionYear}
      />
      <SchoolDropDownSearchInput
        placeholder={'학교 이름을 검색해주세요'}
        title={'학교'}
        onChangeSchool={setSchool}
        value={school}
      />
      <DepartmentDropDownSearchInput
        placeholder="학과 이름을 입력해주세요"
        title="학과"
        onChangeDepartement={setDepartment}
        value={department}
      />
      <TextField
        title="연구실"
        device="pc"
        placeholder="연구실 이름을 입력해주세요"
        value={lab}
        onChange={val => {
          setLab(val);
        }}
      />
      <TextField
        title="연구주제"
        device="pc"
        placeholder="연구 주제를 입력해주세요"
        value={research}
        onChange={val => {
          setResearch(val);
        }}
      />
      <FileUploadForm onChangeFile={file => setFileUpload(file)} />

      {/* 예시: 다음 버튼에서 저장 */}
      {/* <button onClick={storeEducationInfoToSession}>다음</button> */}
    </div>
  );
}
