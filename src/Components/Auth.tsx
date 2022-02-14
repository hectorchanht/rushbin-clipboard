import { Button, Flex, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { supabase } from '../libs/supabaseClient';


export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = React.useState(false)
  const toast = useToast();

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
  const handleClick = () => setShow(!show)

  if (supabase.auth.user()?.id) {
    return (
      <>
        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleLogout}
        >
          Logout {supabase.auth.user()?.email}
        </Button>
        <br />
      </>
    )
  }


  return (
    <form>
      <InputGroup size='md'>
        <Input
          type={'text'}
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      <br />

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
    </form>
  )
}
