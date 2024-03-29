import { MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { DeleteBtn, ResetPasswordBtn, SaveSettingBtn,IsEditingBtn } from '../Components/Buttons';
import { getSettingData, useData } from '../libs/fns';
import { supabase } from '../libs/supabaseClient';


const Toolbar = () => {
  const { setting, setSetting, updateCounter } = useData();

  React.useEffect(() => {
    getSettingData().then(setSetting)
  }, [updateCounter]);

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
        <Button bg={'transparent'} onClick={() => setSetting((d) => ({ ...d, isSettingHidden: !d.isSettingHidden }))} >
          <MinusIcon />
        </Button>
        <DeleteBtn />
        <IsEditingBtn/>
        {supabase.auth.user()?.email && <ResetPasswordBtn />}
        <SaveSettingBtn />
      </Flex>
    )
}

export default Toolbar;
