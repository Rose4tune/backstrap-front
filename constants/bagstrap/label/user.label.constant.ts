export enum StudentType {
  None = 'NONE',
  Master = 'MASTER',
  Phd = 'PHD',
  Postdoctor = 'POSTDOCTOR',
  Undergraduate = 'UNDERGRADUATE',
  Professor = 'PROFESSOR',
  Postgrad = 'POSTGRAD'
}

export const STUDENT_TYPE_LABEL = {
  [StudentType.None]: '-',
  [StudentType.Master]: '석사',
  [StudentType.Phd]: '박사',
  [StudentType.Postdoctor]: '포닥',
  [StudentType.Postgrad]: '대학원생',
  [StudentType.Undergraduate]: '학사',
  [StudentType.Professor]: '교수'
};
