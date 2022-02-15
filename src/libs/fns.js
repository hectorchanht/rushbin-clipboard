
import { useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import { clipDataAtom, loadingAtom, settingAtom } from './states';


export const getData = async ({ currentPage, pageSize }) => {
  if (!currentPage) throw new Error('need currentPage')
  if (!pageSize) throw new Error('need pageSize')
  let dataArray = [];

  const
    user_id = await supabase.auth.user()?.id,
    start = (currentPage * pageSize) - pageSize,
    end = (currentPage * pageSize) - 1;

  if (!user_id) {
    const ls = JSON.parse(localStorage.getItem("rushbin-data"));
    dataArray = (ls && ls.length) ? ls.slice(start, end + 1) : [];
  } else {
    const { data, error } = await supabase.from('rushbin-data').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).range(start, end);
    if (error) {
      throw new Error(error.message)
    }

    dataArray = data
  }
  // console.log(` fns.js --- dataArray:`, { dataArray, currentPage, pageSize, start, end });
  return dataArray;
}

export const postData = async (val) => {
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    const oldData = JSON.parse(localStorage.getItem("rushbin-data")) || [];
    const id = JSON.parse(localStorage.getItem("incremental-id")) || 0;

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

export const removeItem = async (id) => {
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    const oldData = JSON.parse(localStorage.getItem("rushbin-data")) || [];
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
  const [update, setUpdate] = useState(1);
  const upd = () => setUpdate(d => d + 1);


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


  useEffect(async () => {
    if (currentPage < 1 || pageSize < 1) return;

    setIsLoading(d => ({ ...d, get: true }));
    const newData = await getData(setting);
    
    setData(newData);
    setIsLoading(d => ({ ...d, get: false }));
    // console.log(` fns.js --- {setting.currentPage, setting.pageSize, update}:`, { currentPage, pageSize, update, newData })
  }, [currentPage, pageSize, update
    , supabase.auth.user()?.id
  ]);

  return { upd, data, setData, isLoading, setIsLoading, setting, setSetting, toast, toastError }
}