import { Button, Grid, GridItem, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react';
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
        throw new Error(error?.message);
      }
    } catch (error: any) {
      toastError(error)
    } finally {
      setIsLoading(false)
      window.location.reload();
    }
  }

  const handleSignUp = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        throw new Error(error?.message);
      }
    } catch (error: any) {
      toastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error?.message);
      }
    } catch (error: any) {
      toastError(error)
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  }

  const user_id = supabase.auth.user()?.id;

  if (user_id) {
    return (
      <Button
        isLoading={isLoading}
        colorScheme='teal'
        variant='outline'
        onClick={handleLogout}
      >
        Logout
      </Button>
    )
  }

  const handleClick = () => setShow(!show)

  return (
    <>
      {/* <Grid templateColumns='repeat(2, 1fr)' gap={6}>
        <GridItem  >
          <Input
            type={'text'}
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </GridItem>

        <GridItem  >
          <InputGroup size='md'>
            <Input
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </GridItem>


        <GridItem  >
          <Button
            isLoading={isLoading}
            colorScheme='teal'
            variant='outline'
            onClick={handleSignUp}
          >
            signup
          </Button>
        </GridItem>


        <GridItem  >
          <Button
            isLoading={isLoading}
            colorScheme='teal'
            variant='outline'
            onClick={handleLogin}
          >
            Login
          </Button>
        </GridItem>
      </Grid> */}




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
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>


      {/* <Stack direction='row' spacing={6} align='center'> */}
        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleSignUp}
        >
          signup
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme='teal'
          variant='outline'
          onClick={handleLogin}
        >
          Login
        </Button>
      {/* </Stack> */}


    </>
  )
}
