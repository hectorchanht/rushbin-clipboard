import { Button, Textarea } from '@chakra-ui/react';
import React from 'react';
import { postData, useData } from '../libs/fns';

const PostFromText = ({ showInput = true }) => {
  const { updateData, isLoading, setIsLoading } = useData();
  const [text, setText] = React.useState('');

  return <React.Fragment>
    {showInput && <Textarea value={text} onChange={(e) => setText(e.target.value)} />}

    <Button
      isFullWidth
      isDisabled={!text}
      onClick={async () => {
        setIsLoading(d => ({ ...d, post: true }));
        await postData(text);
        setText('');
        updateData();
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