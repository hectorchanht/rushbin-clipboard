import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Button, Flex, Select } from '@chakra-ui/react';
import React from 'react';
import { useData } from '../libs/fns';

const PaginationTool = () => {
  const { data, isLoading, setIsLoading, setting, setSetting  } = useData();

  const { currentPage, pageSize } = setting;

  const handleSelectChange = async (e) => {
    if (e.target.value < 1) return;
    setIsLoading(d => ({ ...d, get: true }));

    setSetting(d => ({ ...d, pageSize: Number(e.target.value), currentPage: 1 }))

    setIsLoading(d => ({ ...d, get: false }));
  }

  return (
    <Flex >
      <Button
        colorScheme='pink' variant='solid'
        isLoading={isLoading.get}
        isDisabled={currentPage <= 1}
        onClick={async () => setSetting(d => ({ ...d, currentPage: d.currentPage - 1 }))}
      >
        <ArrowBackIcon />
      </Button>

      <Select
        placeholder={`page size: ${pageSize}`}
        onChange={handleSelectChange}>
        {[5, 10, 20, 50, 100].map(d => <option key={d} value={d}>{d}</option>)}
      </Select>

      <Button
        colorScheme='pink' variant='solid'
        isDisabled={data.length < pageSize }
        isLoading={isLoading.get}
        onClick={async () => setSetting(d => ({ ...d, currentPage: d.currentPage + 1 }))}
      >
        <ArrowForwardIcon />
      </Button>
    </Flex>
  )
};

export default PaginationTool;