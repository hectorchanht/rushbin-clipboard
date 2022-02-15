
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react';
import { useData } from '../../libs/fns';
import { supabase } from '../../libs/supabaseClient';


const DeleteBtn = () => {
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
};

export default DeleteBtn;