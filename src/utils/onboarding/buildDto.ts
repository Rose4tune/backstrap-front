import { components } from "src/types/api";

// OpenAPI 스키마 타입 alias
export type UserRegisterDto = components['schemas']['UserRegisterDto'];
export type UserEditDto = components['schemas']['UserEditDto'];

// ----------------------
// 매핑 유틸 (로컬→API)
// ----------------------
type ApiStudentType =
    | 'MASTER' | 'NONE' | 'PHD' | 'POSTDOCTOR' | 'POSTGRAD' | 'PROFESSOR' | 'UNDERGRADUATE';
type ApiGender = 'FEMALE' | 'MALE' | 'NONE';
type ApiTerms = 'SERVICE_USE' | 'PERSONAL_INFO_USE' | 'COMMUNITY_RULE' | 'MARKETING';

// 필요시 GraphQL enum import해서 매핑
// import { StudentType as GqlStudentType } from '@generated/graphql';

// ex) 로컬의 studentType을 API 리터럴로 변환
export function mapStudentType(input: unknown): ApiStudentType | undefined {
    const allow: ApiStudentType[] = [
        'MASTER', 'NONE', 'PHD', 'POSTDOCTOR', 'POSTGRAD', 'PROFESSOR', 'UNDERGRADUATE'
    ];
    if (typeof input === 'string' && (allow as string[]).includes(input)) return input as ApiStudentType;
    // GraphQL enum 사용 시:
    // switch (input) { case GqlStudentType.MASTER: return 'MASTER'; ... default: return undefined; }
    return undefined;
}

export function mapGender(input: unknown): ApiGender | undefined {
    const allow: ApiGender[] = ['FEMALE', 'MALE', 'NONE'];
    if (typeof input === 'string' && (allow as string[]).includes(input)) return input as ApiGender;
    return undefined;
}

export function mapAgreedTerms(input?: unknown): ApiTerms[] | undefined {
    if (!Array.isArray(input)) return undefined;
    const allow: ApiTerms[] = ['SERVICE_USE', 'PERSONAL_INFO_USE', 'COMMUNITY_RULE', 'MARKETING'];
    const out = input.filter((t): t is ApiTerms => (allow as string[]).includes(String(t)));
    return out.length ? out : undefined;
}

// undefined/null 키 제거
function stripUndef<T extends object>(obj: T): T {
    const out: any = {};
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        // 빈 배열은 통과(필요 없으면 여기서 걸러도 됨)
        out[k] = v;
    });
    return out;
}

// ----------------------
// 빌더 함수 (state → payload)
// ----------------------

// state 타입은 너의 store 구조에 맞춰 지정해줘.
// 여기선 any로 두고 키 이름만 맞게 사용 예시를 적어둘게.
type SignupState = any;

/** 일반 가입용: UserRegisterDto */
export function buildUserRegister(state: SignupState): UserRegisterDto {
    const payload: UserRegisterDto = stripUndef({
        // 필수/공통
        realName: state.realName,                 // 실명
        name: state.name,                         // 닉네임(또는 화면 설계에 맞게)
        admissionYear: typeof state.admissionYear === 'number' ? state.admissionYear : undefined,
        schoolName: state.schoolName,
        major: state.major,
        studentType: mapStudentType(state.studentType),
        agreedTerms: mapAgreedTerms(state.agreedTerms),

        // 선택
        birth: state.birth,                       // "YYYY-MM-DD" 등
        gender: mapGender(state.gender),
        interestCategories: state.interestCategories, // ['BUSINESS','POLITICS'] 등 (스펙에 맞춰 유효성 필요시 필터)
        labName: state.labName,
        labResearchTopic: state.labResearchTopic,
        profileImageUrl: state.profileImageUrl,
        files: Array.isArray(state.files) ? state.files.map((f: any) => stripUndef({
            description: f.description,
            displayOrder: f.displayOrder,          // number
            fileType: f.fileType,                  // 'MENTOR_CERTIFICATE' | 'SCHOOL_CERTIFICATE'
            fileUuid: f.fileUuid,                  // string
        })) : undefined,
        isPushNotificationOn: state.isPushNotificationOn,
        fcmToken: state.fcmToken,
        entityStatus: state.entityStatus,        // 'ACTIVE' | '...'
        provider: state.provider,                // 'APP' | 'KAKAOTALK' ...
        providerId: state.providerId,
        providerToken: state.providerToken,
        status: state.status,                    // (스펙 Array[3]로 표기돼있는데 실제 codegen 타입 확인 필요)
        email: state.email,
        phone: state.phone,
        password: state.password,

    });

    return payload;
}

/** 소셜/수정용: UserEditDto */
export function buildUserEdit(state: SignupState, opts: { isKakao: boolean, isSocial: boolean }): UserEditDto {
    const payload: UserEditDto = stripUndef({
        // 공통 정보
        realName: state.realName,
        name: state.name,
        admissionYear: typeof state.admissionYear === 'number' ? state.admissionYear : undefined,
        schoolName: state.schoolName,
        major: state.major,
        studentType: mapStudentType(state.studentType),
        agreedTerms: mapAgreedTerms(state.agreedTerms),

        // 추가 필드들
        accountNumber: state.accountNumber,
        bankName: state.bankName,
        bankUserName: state.bankUserName,
        changeLog: state.changeLog,
        description: state.description,
        entityStatus: state.entityStatus,                 // 'ACTIVE' | ...
        fcmToken: state.fcmToken,
        files: Array.isArray(state.files) ? state.files.map((f: any) => stripUndef({
            description: f.description,
            displayOrder: f.displayOrder,
            fileType: f.fileType,
            fileUuid: f.fileUuid,
        })) : undefined,
        gradeTotalType: state.gradeTotalType,             // 'FOUR' | 'FOURFIVE' | 'FOURTHREE'
        isPushNotificationOn: state.isPushNotificationOn,
        labName: state.labName,
        labResearchTopic: state.labResearchTopic,
        profileImageUrl: state.profileImageUrl,
        schoolType: state.schoolType,
        schoolUuid: state.schoolUuid,
        schoolVerificationStatus: state.schoolVerificationStatus, // 'APPROVED' | ...
        totalGrade: typeof state.totalGrade === 'number' ? state.totalGrade : undefined,
        uuid: state.uuid,


        // 이메일/폰 - 카카오는 제외
        ...(opts.isKakao ? {} : opts.isSocial ? {
            email: state.email,
            phone: state.phone,
        } : {
            email: state.email,
            phone: state.phone,
            password: state.password,
        }),
    });

    return payload;
}
