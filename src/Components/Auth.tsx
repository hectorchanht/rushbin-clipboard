import { AddIcon, MinusIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import { settingAtom } from '../states';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = React.useState(false)
  const toast = useToast();

  const [setting, setSetting] = useAtom(settingAtom);

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

  if (setting?.isAuthHidden) {
    return <Button
      leftIcon={<AddIcon />} m={4}
      onClick={() => setSetting((d: any) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}>
      Authentication
    </Button>
  }

  if (supabase.auth.user()?.id) {
    return (
      <Flex justifyContent={'space-between'} my={4}>
        <Button onClick={() => setSetting((d: any) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}        >
          <MinusIcon />
        </Button>

        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleLogout}
        >
          Logout {supabase.auth.user()?.email}
        </Button>
      </Flex>
    )
  }

  return (
    <Box as={'form'} my={4}>
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

      <Flex justifyContent={'space-between'}>
        <Button onClick={() => setSetting((d: any) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}     >
          <MinusIcon />
        </Button>

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
  )
}
