import { MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
import { DeleteBtn, ResetPasswordBtn, SaveSettingBtn } from '../Components/Buttons';
import { getSettingData } from '../libs/fns';
import { settingAtom } from '../libs/states';
import { supabase } from '../libs/supabaseClient';


const Toolbar = () => {
  const [setting, setSetting] = useAtom(settingAtom);

  React.useEffect(() => getSettingData(setting).then(setSetting), []);

  return setting?.isSettingHidden
    ? (
      <Box as={'span'} my={4}>
        <Button mx={4} colorScheme={'blue'}
          onClick={() => setSetting((d) => ({ ...d, isSettingHidden: !d.isSettingHidden }))} >
          <SettingsIcon />
        </Button>
        <SaveSettingBtn />
      </Box>
    )
    : (
      <Flex justifyContent={'space-between'} my={4}>
        <Button onClick={() => setSetting((d) => ({ ...d, isSettingHidden: !d.isSettingHidden }))} >
          <MinusIcon />
        </Button>
        <DeleteBtn />
        {supabase.auth.user()?.email && <ResetPasswordBtn />}
        <SaveSettingBtn />
      </Flex>
    )
}

export default Toolbar;
