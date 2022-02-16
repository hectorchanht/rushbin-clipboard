import { Button, Textarea } from '@chakra-ui/react';
import React from 'react';
import useClipboard from 'react-hook-clipboard';
import { postData, useData } from '../libs/fns';

const PostFromClipboard = ({ showInput = true }) => {
  const [clipboard] = useClipboard({ updateFrequency: 64 });
  const { updateData, isLoading, setIsLoading, toastError } = useData();


  return <React.Fragment>
    {showInput && <Textarea value={clipboard} isReadOnly />}

    <Button isFullWidth
      onClick={async () => {
        setIsLoading(d => ({ ...d, post: true }));
        await navigator.clipboard.readText()
          .then(postData).then(updateData)
          .catch(() => toastError('Clipboard read permission denied, Enables it under site information of browser'));
        setIsLoading(d => ({ ...d, post: false }));
      }}
      isLoading={isLoading.post}
      // rightIcon={<AddIcon />}
      // isDisabled={!clipboard}  // this cause error catching above useless
      colorScheme='teal' variant='solid'>
      Save Clipboard
    </Button>
  </React.Fragment>
}

export default PostFromClipboard;