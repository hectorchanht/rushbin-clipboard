import { AddIcon } from '@chakra-ui/icons';
import { Button, Textarea } from '@chakra-ui/react';
import React from 'react';
import { postData, useData } from '../libs/fns';

const PostFromText = () => {
  const { upd, isLoading, setIsLoading } = useData();
  const [text, setText] = React.useState('');

  return <React.Fragment>
    <Textarea
      mt={4}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <Button
      isFullWidth
      isDisabled={!text}
      onClick={async () => {
        setIsLoading(d => ({ ...d, post: true }));
        await postData(text).then(() => setText(''));
        upd();
        setIsLoading(d => ({ ...d, post: false }));
      }}
      isLoading={isLoading.post}
      rightIcon={<AddIcon />}
      colorScheme='teal'
      variant='solid'>
      Save from Text Box
    </Button>
  </React.Fragment>
}

export default PostFromText;