import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Grid, GridItem, Textarea, useToast } from '@chakra-ui/react';
import React from 'react';
//@ts-ignore
import useClipboard from 'react-hook-clipboard';
import { supabase } from '../libs/supabaseClient';


const HistoricalData = () => {
  const [historicalData, setHistoricalData] = React.useState<string[] | []>([]);
  const [clipboard, copyToClipboard] = useClipboard({ updateFrequency: 50 });
  const [isLoading, setIsLoading] = React.useState({ add: false, remove: false });

  const toast = useToast();

  const toastError = (msg: string) => toast({
    title: msg,
    status: 'error',
    isClosable: true,
  })


  const paste = () => navigator.clipboard.readText()
    .then(async clipText => {
      const user_id = supabase.auth.user()?.id;
      setIsLoading(d => ({ ...d, add: true }))
      if (!user_id) {
        toastError('Please login');
        return;
      }

      const { data, error }: any = await supabase
        .from('rushbin-data')
        .insert([
          { val: clipText, user_id }
        ])
      setIsLoading(d => ({ ...d, add: false }))

      if (error) {
        toastError(error.message);
        return
      }
      setHistoricalData(d => [...data, ...d])
    });

  const getData = async () => {
    // todo: pagination
    const user_id = supabase.auth.user()?.id;

    if (!user_id) {
      setHistoricalData([]);
      return;
    }

    let { data, error }: any = await supabase
      .from('rushbin-data')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
    if (error) {
      toastError(error.message);
      return
    }
    setHistoricalData(data)
  }

  const removeItem = async (id: string) => {
    setIsLoading(d => ({ ...d, remove: true }))
    const { data, error } = await supabase
      .from('rushbin-data')
      .delete()
      .eq('id', id);
    setIsLoading(d => ({ ...d, remove: false }))

    console.log(` HistoricalData.tsx --- { data, error }:`, { data, error })
    if (error) {
      toastError(error.message);
      return
    }
    // @ts-ignore
    setHistoricalData(d => d.filter(dd => dd.id !== data[0].id))
  }

  React.useEffect(() => {
    getData()
    console.log(` index.tsx --- getData():`,)

  }, [supabase.auth.user()?.id]);

  if (!supabase.auth.user()?.id) return null;

  return (
    <>
      <Box maxH={'200px'} overflowY={'auto'}>
        <Textarea value={clipboard} />
      </Box>

      <Button onClick={paste} isLoading={isLoading.add} rightIcon={<AddIcon />} colorScheme='teal' variant='solid'>
        Save Clipboard
      </Button>

      <br />
      <br />
      <Divider />
      <br />

      <Grid
        templateColumns='repeat(5, 1fr)'
        gap={6}
        alignItems={'center'}
      >
        {historicalData.map((d: any) => (
          <React.Fragment key={d.id}          >
            <GridItem rowSpan={1} >
              <Button onClick={() => copyToClipboard(d.val)}>
                <DownloadIcon />
              </Button>
            </GridItem>
            <GridItem cursor={'pointer'} colSpan={1} >
              <Button onClick={() => removeItem(d.id)} isLoading={isLoading.remove}>
                <DeleteIcon />
              </Button>
            </GridItem>
            <GridItem colSpan={3} >
              <Textarea value={d.val} />
            </GridItem>
          </React.Fragment>
        ))}
      </Grid>
    </>
  )
}

export default HistoricalData;
