
import { useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
import { supabase } from '../libs/supabaseClient';
import { clipDataAtom, DEFAULT_PAGE_SIZE, DEFAULT_SETTING, loadingAtom, settingAtom } from './states';

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getData = async ({ currentPage, pageSize }) => {
  if (!currentPage) {
    currentPage = 1;
    // throw new Error('need currentPage')
  }
  if (!pageSize) {
    pageSize = DEFAULT_PAGE_SIZE
    // throw new Error('need pageSize')
  }
  let dataArray = [];

  const
    user_id = supabase.auth.user()?.id,
    start = (currentPage * pageSize) - pageSize,
    end = (currentPage * pageSize) - 1;

  if (!user_id) {
    const ls = getLocalStorage(tableNames.data);
    dataArray = (ls && ls.length) ? ls.slice(start, end + 1) : [];
  } else {
    const { data, error } = await supabase.from('rushbin-data').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).range(start, end);
    if (error) {
      throw new Error(error.message)
    }

    dataArray = data
  }
  // console.log(` fns.js ---:`, { currentPage, pageSize, start, end, dataArray });
  return dataArray;
}

export const postData = async (val) => {
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    const oldData = getLocalStorage(tableNames.data);
    const id = getLocalStorage(tableNames.id);

    const data = [{ id, val, created_at: new Date(), user_id: 'localStorage' }, ...oldData];

    localStorage.setItem("rushbin-data", JSON.stringify(data));
    localStorage.setItem("incremental-id", JSON.stringify(Number(id) + 1));
  } else {
    const { error } = await supabase.from('rushbin-data').insert([{ val, user_id }])

    if (error) {
      throw new Error(error.message);
    }
  }
};

export const deleteData = async (id) => {
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    const oldData = getLocalStorage(tableNames.data);
    const data = oldData.filter((d) => d.id !== id);
    localStorage.setItem("rushbin-data", JSON.stringify(data));
  } else {
    const { error } = await supabase.from('rushbin-data').delete().eq('id', id).eq('user_id', user_id);

    if (error) {
      throw new Error(error.message)
    }
  }
}

export const useData = () => {
  const [updateCounter, setUpdateCounter] = React.useState(1);
  const updateData = () => setUpdateCounter(d => d + 1);

  const [data, setData] = useAtom(clipDataAtom);
  const [isLoading, setIsLoading] = useAtom(loadingAtom);
  const [setting, setSetting] = useAtom(settingAtom);
  const { currentPage, pageSize } = setting;
  const toast = useToast();
  const toastError = (msg) => toast({
    title: msg,
    status: 'error',
    isClosable: true,
  });

  React.useEffect(async () => {
    if (currentPage < 1 || pageSize < 1) return;
    if (isLoading.get) return;

    setIsLoading(d => ({ ...d, get: true }));
    const newData = await getData(setting);
    setData(newData);

    setIsLoading(d => ({ ...d, get: false }));
    // console.log(` fns.js --- {setting.currentPage, setting.pageSize, update}:`, { currentPage, pageSize, updateCounter, newData })
  }, [currentPage, pageSize, updateCounter]);

  return { updateData, updateCounter, data, setData, isLoading, setIsLoading, setting, setSetting, toast, toastError }
};

export const getSettingData = async () => {
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    return getLocalStorage(tableNames.setting);
  } else {
    const { data, error } = await supabase.from('rushbin-setting').select('*').eq('user_id', user_id).single();
    if (!data) {
      return DEFAULT_SETTING
    } else {
      return data;
    }
  }
};


const tableNames = {
  setting: 'rushbin-setting',
  data: 'rushbin-data',
  id: 'incremental-id',
};


const getLocalStorage = (table = tableNames.data) => {
  switch (table) {
    case tableNames.setting: return JSON.parse(localStorage.getItem("rushbin-setting")) || DEFAULT_SETTING;
    case tableNames.data: return JSON.parse(localStorage.getItem("rushbin-data")) || [];
    case tableNames.id: return JSON.parse(localStorage.getItem("incremental-id")) || 0;
    default: throw new Error('not implemented in getLocalStorage ')
  }
}

export const patchData = ({ id, val }) => {
  console.log(` fns.js --- patchData:`, patchData)

  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    const oldData = getLocalStorage(tableNames.data);
    const newData = oldData.reduce((p, c) => {
      console.log(` fns.js --- {p,c}:`, { p, c })

      if (c.id === id) {
        console.log(` fns.js --- diu:`,)

        return [...p, { ...c, val }];
      }
      return [...p, c];
    }, []);
    console.log(` fns.js --- {oldData, newData}:`, { oldData, newData })

    localStorage.setItem("rushbin-data", JSON.stringify(newData));


  } else {

  }
}