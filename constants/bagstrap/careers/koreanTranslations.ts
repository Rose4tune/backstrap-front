type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  educations: {
    IRRELEVANCE: '학력 무관',
    HIGH_SCHOOL: '고졸',
    BACHELOR: '학사',
    MASTER: '석사',
    DOCTOR: '박사',
    JUNIOR_COLLEGE: '초대졸'
  }
};

export default translations;
