import { StarIcon } from '@chakra-ui/icons';
import { Button, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
import { settingAtom } from '../../libs/states';
import { supabase } from '../../libs/supabaseClient';


const SaveSettingBtn = () => {
  const toast = useToast();

  const [setting] = useAtom(settingAtom);

  const saveSetting = async () => {
    const user_id = supabase.auth.user()?.id;
    if (!user_id) {
      localStorage.setItem("rushbin-setting", JSON.stringify(setting));
      toast({ title: 'Setting Saved Locally', status: 'success' });
    } else {
      const { error, data } = await supabase.from('rushbin-setting').update({ ...setting, user_id }).eq('user_id', user_id);
      if (error) {
        const { error, data } = await supabase.from('rushbin-setting').insert([{ ...setting, user_id }], { upsert: true });
        if (error) {
          throw new Error(error.message);
        }
      }
      toast({ title: 'Setting Saved In Cloud', status: 'success' });
    }
  }

  return <Button colorScheme='blue' onClick={saveSetting}>
    <StarIcon />
  </Button>
}

export default SaveSettingBtn;