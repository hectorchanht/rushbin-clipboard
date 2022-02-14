import { AddIcon, MinusIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { supabase } from '../libs/supabaseClient';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = React.useState(false)
  const toast = useToast();

  const [isHidden, setIsHidden] = useState(false);

  const toastError = (msg: string) => toast({
    title: msg,
    status: 'error',
    isClosable: true,
  })


  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) {
        toastError(error?.message)

      }
    } finally {
      setIsLoading(false)
      // window.location.reload();
    }
  }

  const handleSignUp = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        toastError(error?.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut();
      if (error) {
        toastError(error?.message)
      }
    } finally {
      setIsLoading(false);
      // window.location.reload();
    }
  }
  const handleClick = () => setShow(!show);

  if (isHidden) {
    return <Button
      onClick={() => setIsHidden(d => !d)}
      position={'absolute'} left={'10vw'}>
      <AddIcon />
    </Button>
  }

  if (supabase.auth.user()?.id) {
    return (
      <Box>
        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleLogout}
        >
          Logout {supabase.auth.user()?.email}
        </Button>

        <Button
          onClick={() => setIsHidden(d => !d)}
          position={'absolute'} left={'10vw'}>
          <MinusIcon />
        </Button>
        <br />
      </Box>
    )
  }


  return (
    <>
      <Button
        onClick={() => setIsHidden(d => !d)}
        position={'absolute'} left={'10vw'}>
        <MinusIcon />
      </Button>
      <Box as={'form'} mb={4}>
        <InputGroup size='md' mb={4}>
          <Input
            type={'text'}
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Flex justifyContent={'space-around'}>
          <Button
            isLoading={isLoading}
            colorScheme='teal'
            variant='outline'
            onClick={handleSignUp}
          >
            Sign up
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme='teal'
            variant='outline'
            onClick={handleLogin}
          >
            Login
          </Button>
        </Flex>
      </Box>
    </>
  )
}
