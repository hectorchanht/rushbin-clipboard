import { AddIcon, ArrowBackIcon, ArrowForwardIcon, DeleteIcon, DownloadIcon, MinusIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, GridItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Stack, Text, Textarea, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
//@ts-ignore
import useClipboard from 'react-hook-clipboard';
import { supabase } from '../libs/supabaseClient';
import { settingAtom } from '../states';

/*
logic:

const user_id = supabase.auth.user()?.id

if user_id exist, get/set data to supabase
else get/set to localStorage



attributes of rushbin-setting
1. pageSize
*/

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = React.useState<string[] | []>([]);
  const [clipboard, copyToClipboard] = useClipboard({ updateFrequency: 50 });
  const [isLoading, setIsLoading] = React.useState({ add: false, remove: false, get: false });
  const [pagination, setPagination] = React.useState({ currentPage: 1, pageSize: 5 });
  const [freeText, setFreeText] = React.useState('')
  const [setting, setSetting] = useAtom(settingAtom);

  const toast = useToast();

  const toastError = (msg: string) => toast({
    title: msg,
    status: 'error',
    isClosable: true,
  });

  const PaginationTool = () => (
    <Flex >
      <Button
        colorScheme='pink' variant='solid'
        isDisabled={pagination.currentPage <= 1}
        onClick={() => setPagination(d => ({ ...d, currentPage: d.currentPage - 1 }))}
      >
        <ArrowBackIcon />
      </Button>

      <Select
        value={pagination.pageSize}
        placeholder={`page size: ${pagination.pageSize}`}
        onChange={(e) => setPagination(d => ({ ...d, pageSize: Number(e.target.value) }))}>
        {[5, 10, 20, 50, 100].map(d => <option key={d} value={d}>{d}</option>)}
      </Select>

      <Button
        colorScheme='pink' variant='solid'
        isDisabled={historicalData.length < pagination.pageSize}
        onClick={() => setPagination(d => ({ ...d, currentPage: d.currentPage + 1 }))}
      >
        <ArrowForwardIcon />
      </Button>
    </Flex>
  );

  const handleSave = async (clipText: string) => {
    const user_id = supabase.auth.user()?.id;

    setIsLoading(d => ({ ...d, add: true }));
    try {
      if (!user_id) {
        // @ts-ignore
        const oldData = JSON.parse(localStorage.getItem("rushbin-data")) || [];
        // @ts-ignore
        const incrementalId = JSON.parse(localStorage.getItem("incremental-id")) || 0;
        const data = [{ id: incrementalId, created_at: new Date(), val: clipText, user_id: 'localStorage' }, ...oldData];
        localStorage.setItem("rushbin-data", JSON.stringify(data));
        localStorage.setItem("incremental-id", JSON.stringify(Number(incrementalId) + 1));

        return;
      }

      const { data, error }: any = await supabase
        .from('rushbin-data')
        .insert([{ val: clipText, user_id }])

      if (error) {
        toastError(error.message);
        return
      }
    } finally {
      getData();
      setIsLoading(d => ({ ...d, add: false }))
    }
  };

  const getData = async () => {
    setIsLoading(d => ({ ...d, get: true }))
    let dataArray = [];
    const user_id = supabase.auth.user()?.id;

    const
      start = (pagination.currentPage * pagination.pageSize) - pagination.pageSize,
      end = (pagination.currentPage * pagination.pageSize) - 1;
    // console.log(` HistoricalData.tsx --- {start,end}:`, { start, end, currentPage: pagination.currentPage, pageSize: pagination.pageSize })

    try {
      if (!user_id) {
        // @ts-ignore
        dataArray = JSON.parse(localStorage.getItem("rushbin-data")).slice(start, end + 1) || [];
      } else {
        const { data, error }: any = await supabase
          .from('rushbin-data')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .range(start, end);
        if (error) {
          toastError(error.message);
          return
        }

        dataArray = data
      }
    }
    finally {
      setIsLoading(d => ({ ...d, get: false }))
      setHistoricalData(dataArray)
    }
  }

  const removeItem = async (id: string) => {
    setIsLoading(d => ({ ...d, remove: true }));
    const user_id = supabase.auth.user()?.id;

    try {
      if (!user_id) {
        // @ts-ignore
        const oldData = JSON.parse(localStorage.getItem("rushbin-data")) || [];
        const data = oldData.filter((d: { id: string }) => d.id !== id);

        localStorage.setItem("rushbin-data", JSON.stringify(data));
        return;
      }

      const { error } = await supabase
        .from('rushbin-data')
        .delete()
        .eq('id', id);

      if (error) {
        toastError(error.message);
        return
      }
    } finally {
      getData();
      setIsLoading(d => ({ ...d, remove: false }));
    }
  }

  const getUserSetting = async () => {
    let setting: any;
    const user_id = supabase.auth.user()?.id;

    if (!user_id) {
      // @ts-ignore
      setting = JSON.parse(localStorage.getItem("rushbin-setting")) || {};

    } else {
      const { data, error }: any = await supabase
        .from('rushbin-setting')
        .select('pageSize')
        .eq('user_id', user_id)
        .single();

      if (error) {
        toastError(error.message);
        return
      }
      setting = data;
    }

    setPagination(d => ({ ...d, ...setting }))
  }

  const RenderSaveUserSetting = () => {
    const saveUserSetting = async () => {
      let setting;
      const user_id = supabase.auth.user()?.id;

      if (!user_id) {
        // @ts-ignore
        setting = localStorage.setItem("rushbin-setting", JSON.stringify({ pageSize: pagination.pageSize }));
      } else {
        try {
          const { error } = await supabase
            .from('rushbin-setting')
            .update({ pageSize: pagination.pageSize })
            .eq('user_id', user_id)
        } catch (e) {
          const { error } = await supabase
            .from('rushbin-setting')
            .insert([{ pageSize: pagination.pageSize }], { upsert: true })
        }
      }
    }

    return <Box>
      <Button colorScheme='blue' onClick={saveUserSetting}>
        Save Setting
      </Button>
    </Box>
  }

  React.useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      getData();
    });
    getUserSetting();
  }, []);

  React.useEffect(() => {
    getData();
  }, [pagination.currentPage, pagination.pageSize]);

  const RenderDeleteData = ({ getData, data }: any) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);

    const handleClearData = async () => {
      const user_id = supabase.auth.user()?.id;

      if (user_id) {
        await supabase
          .from('rushbin-data')
          .delete()
          .eq('user_id', user_id);
      } else {
        localStorage.setItem("rushbin-data", JSON.stringify([]));
        localStorage.setItem("incremental-id", JSON.stringify(0));
      }

      getData && getData();
    }

    return (
      <Box>
        <Button colorScheme='red' onClick={() => setIsOpen(true)} isDisabled={data.length < 1}>
          Delete Data
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Data</ModalHeader>
            <ModalBody>
              <Text>
                are you sure to delete all data?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>
                No
              </Button>
              <Button colorScheme='red' ml={3} onClick={handleClearData}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    )
  }


  return (
    <>
      {setting?.isSettingHidden
        ? (
          <Button
            leftIcon={<AddIcon />} my={4}
            onClick={() => setSetting((d: any) => ({ ...d, isSettingHidden: !d.isSettingHidden }))} >
            setting
          </Button>
        )
        : (
            <Flex justifyContent={'space-between'} my={4}>
              <Button onClick={() => setSetting((d: any) => ({ ...d, isSettingHidden: !d.isSettingHidden }))} >
                <MinusIcon />
              </Button>

              <RenderDeleteData data={historicalData} getData={getData} />
              <RenderSaveUserSetting />
            </Flex>
        )
      }

      <Textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder='Text Box'
      />
      <Button isFullWidth isDisabled={!freeText}
        onClick={() => handleSave(freeText).then(() => setFreeText(''))} isLoading={isLoading.add}
        rightIcon={<AddIcon />} colorScheme='teal' variant='solid'>
        Save from Text Box
      </Button>

      {/* <Flex alignItems={'center'} my={6}>
        <Divider />
        or
        <Divider />
      </Flex> */}
      <br />
      <br />

      <Textarea value={clipboard} isReadOnly />

      <Button isFullWidth onClick={() => navigator.clipboard.readText().then(d => handleSave(d))} isLoading={isLoading.add} rightIcon={<AddIcon />} colorScheme='teal' variant='solid'>
        Save from Clipboard
      </Button>

      <br />
      <br />
      <PaginationTool />
      <br />

      {
        isLoading.get
          ? <RenderLoadingData />
          : <LocalGrid>
            {historicalData.map((d: any) => (
              <React.Fragment key={`${d.id}_${d.val}`}>
                <GridItem rowSpan={1} >
                  <Button isFullWidth onClick={() => copyToClipboard(d.val)}>
                    <DownloadIcon />
                  </Button>
                </GridItem>
                <GridItem colSpan={1} >
                  <Button isFullWidth onClick={() => removeItem(d.id)} isLoading={isLoading.remove}>
                    <DeleteIcon />
                  </Button>
                </GridItem>
                <GridItem colSpan={4} >
                  <Textarea value={d.val} isReadOnly />
                </GridItem>
              </React.Fragment>
            ))}
          </LocalGrid>
      }
    </>
  )
}

const RenderLoadingData = () => <LocalGrid>
  {[...Array(5)].map((_, i) => <React.Fragment key={i}>
    <GridItem colSpan={1} >
      <Skeleton height='50px' />
    </GridItem>
    <GridItem colSpan={1} >
      <Skeleton height='50px' />
    </GridItem>
    <GridItem colSpan={4} >
      <Skeleton height='80px' />
    </GridItem>
  </React.Fragment>
  )}
</LocalGrid>;

const LocalGrid = ({ children, ...rest }: any) => (
  <Grid
    templateColumns='repeat(6, 1fr)'
    gap={3}
    alignItems={'center'}
    textAlign={'left'}
    {...rest}
  >
    {children}
  </Grid>
);


export default HistoricalData;
