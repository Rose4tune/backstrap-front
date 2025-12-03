export interface FAEntityFileRegisterDto {
  fileUuid: string;
  displayOrder: number;
  fileType?: 'SCHOOL_CERTIFICATE' | 'MENTOR_CERTIFICATE';
  description?: string;
}
