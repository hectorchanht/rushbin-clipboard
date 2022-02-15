import { MinusIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import { settingAtom } from '../states';

const AccountIcon = (props) => <Icon viewBox='0 0 20 20' {...props}>
  <path fill='currentColor' d="M3 5v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5a2 2 0 00-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></path>
</Icon>;


export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = React.useState(false)
  const toast = useToast();

  const [setting, setSetting] = useAtom(settingAtom);

  const toastError = (msg) => toast({
    title: msg,
    status: 'error',
    isClosable: true,
  })


  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const cred = password.length ? { email, password } : { email };
      const { error } = await supabase.auth.signIn(cred);

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
    return <Button colorScheme={'blue'}
      onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}>
      <AccountIcon />
    </Button>
  }

  if (supabase.auth.user()?.id) {
    return (
      <Flex justifyContent={'space-between'} my={4}>
        <Button onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}        >
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
    <Box as={'form'} mb={4}>
      <InputGroup size='md' mb={4}>
        <Input
          autoComplete
          type={'email'}
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {validateEmail(email) && <>
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
        </>}
      </InputGroup>

      <Flex justifyContent={'space-between'}>
        <Button onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}     >
          <MinusIcon />
        </Button>

        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={password.length ? handleSignUp : handleLogin}
          isDisabled={!validateEmail(email)}
        >
          {password.length ? 'Sign Up' : 'Magic Login'}
        </Button>
        {password && <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleLogin}
          isDisabled={!validateEmail(email) && password}
        >
          Login
        </Button>}
      </Flex>
    </Box>
  )
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
