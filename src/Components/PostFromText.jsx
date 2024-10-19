import { Button, Textarea } from '@chakra-ui/react';
import React from 'react';
import { postData, useData } from '../libs/fns';

const PostFromText = ({ showInput = true }) => {
  const { updateData, isLoading, setIsLoading, toastError } = useData();
  const [text, setText] = React.useState('');

  return <React.Fragment>
    {showInput && <Textarea value={text} onChange={(e) => setText(e.target.value)} />}

    <Button
      isFullWidth
      isDisabled={!text}
      onClick={async () => {
        setIsLoading(d => ({ ...d, post: true }));
        await postData(text).then(updateData).catch(({ message }) => {
          return toastError(message || 'Clipboard read permission denied, Enables it under site information of browser')
        });
        setText('');
        setIsLoading(d => ({ ...d, post: false }));
      }}
      isLoading={isLoading.post}
      // rightIcon={<AddIcon />}
      colorScheme='teal'
      variant='solid'>
      Save Text
    </Button>
  </React.Fragment>
}

export default PostFromText;