import { AddIcon } from '@chakra-ui/icons';
import { Button, Textarea } from '@chakra-ui/react';
import React from 'react';
import useClipboard from 'react-hook-clipboard';
import { postData, useData } from '../libs/fns';

const PostFromClipboard = () => {
  const [clipboard] = useClipboard({ updateFrequency: 50 });
  const { upd, isLoading, setIsLoading } = useData();


  return <React.Fragment>
    <Textarea value={clipboard} isReadOnly />

    <Button isFullWidth
      onClick={async () => {
        setIsLoading(d => ({ ...d, post: true }));
        await navigator.clipboard.readText().then(postData);
        upd();
        setIsLoading(d => ({ ...d, post: false }));
      }}
      isLoading={isLoading.post} rightIcon={<AddIcon />}
      colorScheme='teal' variant='solid'>
      Save from Clipboard
    </Button>
  </React.Fragment>
}

export default PostFromClipboard;