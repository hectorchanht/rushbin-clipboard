import { atom } from 'jotai';


export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_SETTING = {
  isAuthHidden: false,
  isSettingHidden: false,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isEditing: false,
};

export const settingAtom = atom(DEFAULT_SETTING);

export const loadingAtom = atom({
  get: false,
  post: false,
  delete: false,
  auth: false
});

export const clipDataAtom = atom([]);
