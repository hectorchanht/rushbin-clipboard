import { CheckIcon, CloseIcon, DeleteIcon, MinusIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
import { useData } from '../libs/fns';
import { DEFAULT_SETTING, settingAtom } from '../libs/states';
import { supabase } from '../libs/supabaseClient';

const SaveSettingBtn = () => {
  const toast = useToast();

  const [setting] = useAtom(settingAtom);

  const saveSetting = async () => {
    const user_id = supabase.auth.user()?.id;
    if (!user_id) {
      localStorage.setItem("rushbin-setting", JSON.stringify(setting));
      toast({ title: 'Setting Saved Locally', status: 'success' });
    } else {
      const { error } = await supabase.from('rushbin-setting').update(setting).eq('user_id', user_id);
      if (error) {
        const { error } = await supabase.from('rushbin-setting').insert([setting], { upsert: true });
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

        <RenderDeleteData />
        <SaveSettingBtn />
      </Flex>
    )
}

export default Toolbar;

const getSettingData = async (setting = DEFAULT_SETTING) => {
  let s = setting;
  const user_id = supabase.auth.user()?.id;

  if (!user_id) {
    s = JSON.parse(localStorage.getItem("rushbin-setting")) || DEFAULT_SETTING;
  } else {
    const { data, error } = await supabase.from('rushbin-setting').select('*').eq('user_id', user_id).single();

    if (!data) {
      return s
    } else {
      s = data;
    }

    if (error) {
      // occurs if `rushbin-setting`.rows === 0
      if (error.message !== "JSON object requested, multiple (or no) rows returned") {
        throw new Error(error.message);
      }
    }
  }

  return s;
}


const RenderDeleteData = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const { data, setData } = useData();

  const handleClearData = async () => {
    const user_id = supabase.auth.user()?.id;

    setData([]);
    onClose();

    if (user_id) {
      await supabase.from('rushbin-data').delete().eq('user_id', user_id);
    } else {
      localStorage.setItem("rushbin-data", JSON.stringify([]));
      localStorage.setItem("incremental-id", JSON.stringify(0));
    }
  }

  return (
    <Box>
      <Button colorScheme='red' onClick={() => setIsOpen(true)} isDisabled={data.length < 1}>
        <DeleteIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Data</ModalHeader>
          <ModalBody>
            <Text>
              Are you sure to delete all data {supabase.auth.user()?.id ? 'online' : 'locally'}?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              <CloseIcon />
            </Button>
            <Button colorScheme='red' ml={3} onClick={handleClearData}>
              <CheckIcon />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}