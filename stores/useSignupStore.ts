import { FAEntityFileRegisterDto } from '@dto/FAEntityFileRegisterDto';
import { GenderType, StudentType, UserRegisterDto } from '@dto/UserRegisterDTO';
import { makeAutoObservable } from 'mobx';

class UserSignupStore {
  state: UserRegisterDto;

  constructor() {
    this.state = {
      admissionYear: new Date().getFullYear(),
      agreedTerms: [],
      email: '',
      files: [],
      isPushNotificationOn: true,
      labName: '',
      labResearchTopic: '',
      major: '',
      name: '',
      password: '',
      phone: '',
      provider: 'APP',
      realName: '',
      schoolName: '',
      studentType: StudentType.UNDERGRADUATE
    };

    makeAutoObservable(this);
  }

  update(payload: Partial<UserRegisterDto>) {
    this.state = { ...this.state, ...payload };
  }

  toDto(): UserRegisterDto {
    return this.state;
  }
}

export const userSignupStore = new UserSignupStore();
