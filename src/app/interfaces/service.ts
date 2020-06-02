import { Profile } from './profile';

export interface Service {
    from_profile: Profile;
    status: 'done' | 'recused' | 'approved' | 'requested';
}