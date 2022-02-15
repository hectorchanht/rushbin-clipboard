import { MinusIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useData, validateEmail } from '../libs/fns';
import { supabase } from '../libs/supabaseClient';
// import { GithubLoginBtn } from '../Components/Buttons'

const AccountIcon = (props) => <Icon viewBox='0 0 24 24' {...props}>
  <path fill='currentColor' d="M3 5v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5a2 2 0 00-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></path>
</Icon>;

const SwitchAccountIcon = (props) => <Icon viewBox='0 0 24 24' {...props}>
  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H8v-1.5c0-1.99 4-3 6-3s6 1.01 6 3V16z"></path>
</Icon>;

export default function Auth() {
  const { updateData, isLoading, setIsLoading, setting, setSetting, toast, toastError } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = React.useState(false);

  const handleLogin = async () => {
    setIsLoading(d => ({ ...d, auth: true }));

    const cred = password.length ? { email, password } : { email };
    const { error } = await supabase.auth.signIn(cred);

    if (error) {
      toastError(error?.message);
    } else {
      updateData();
    }
    setIsLoading(d => ({ ...d, auth: false }));
  }

  const clearEmailPassword = () => {
    setEmail('');
    setPassword('');
  }

  const magicLogin = async () => {
    setIsLoading(d => ({ ...d, auth: true }));

    const { data, error } = await supabase.auth.signIn({ email });

    if (error) {
      toastError(error?.message);
    } else {
      toast({
        title: 'Go check Your email!',
        status: 'success'
      })
    }
    setIsLoading(d => ({ ...d, auth: false }));
  }

  const handleSignUp = async () => {
    setIsLoading(d => ({ ...d, auth: true }));

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toastError(error?.message);
    } else {
      updateData();
      clearEmailPassword()
    }
    setIsLoading(d => ({ ...d, auth: false }));
  }

  const handleLogout = async () => {
    setIsLoading(d => ({ ...d, auth: true }));

    const { error } = await supabase.auth.signOut();
    if (error) {
      toastError(error?.message);
    } else {
      updateData();
      clearEmailPassword()
    }
    setIsLoading(d => ({ ...d, auth: false }));
  }

  if (setting?.isAuthHidden) {
    return (
      <Button
        colorScheme={'blue'} //  
        onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}>
        {supabase.auth.user()?.id ? <SwitchAccountIcon /> : <AccountIcon />}
      </Button>
    )
  }

  if (supabase.auth.user()?.id) {
    return (
      <Flex justifyContent={'space-between'} my={4}>
        <Button onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}        >
          <MinusIcon />
        </Button>

        <Button
          isLoading={isLoading.auth}
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
          autoComplete={'email'}
          type={'email'}
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {validateEmail(email) && <>
          <Input
            autoComplete='current-password'
            type={show ? 'text' : 'password'}
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </>}
      </InputGroup>

      {<Flex justifyContent={'space-between'}>
        <Button onClick={() => setSetting((d) => ({ ...d, isAuthHidden: !d.isAuthHidden }))}     >
          <MinusIcon />
        </Button>
        {/* <GithubLoginBtn/> */}

        {(email.length >= 1) && validateEmail(email) && <>
          <Button
            isLoading={isLoading.auth}
            colorScheme='teal'
            variant='outline'
            onClick={handleSignUp}
            isDisabled={!validateEmail(email) || password.length < 6}
          >
            Sign Up
          </Button>
          <Button
            isLoading={isLoading.auth}
            colorScheme='teal'
            variant='outline'
            onClick={magicLogin}
            isDisabled={!validateEmail(email)}
          >
            Magic Login
          </Button>
          <Button
            isLoading={isLoading.auth}
            colorScheme='teal'
            variant='outline'
            onClick={handleLogin}
            isDisabled={!validateEmail(email) || password.length < 6}
          >
            Login
          </Button>
        </>}
      </Flex>}
    </Box>
  )
}

