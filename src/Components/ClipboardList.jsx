import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Grid, GridItem, Skeleton, Textarea } from '@chakra-ui/react';
import React from 'react';
import useClipboard from 'react-hook-clipboard';
import { removeItem, useData } from '../libs/fns';

const LocalGrid = ({ children, ...rest }) => (
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

const RenderLoadingData = (props) => (
  <LocalGrid {...props}>
    {[...Array(5)].map((_, i) => (
      <React.Fragment key={i}>
        <GridItem colSpan={1}>
          <Skeleton height='50px' width={'60px'} />
        </GridItem>
        <GridItem colSpan={1}>
          <Skeleton height='50px' width={'60px'} />
        </GridItem>
        <GridItem colSpan={4}>
          <Skeleton height='80px' />
        </GridItem>
      </React.Fragment>))}
  </LocalGrid>
);


const ClipboardList = () => {
  const [, copyToClipboard] = useClipboard({ updateFrequency: 50 });
  const { updateData, data, isLoading, setIsLoading } = useData();

  return isLoading.get
    ? <RenderLoadingData />
    : <LocalGrid>
      {data.map((d) => (
        <React.Fragment key={`${d.id}_${d.val}`}>
          <GridItem rowSpan={1}>
            <Button onClick={() => copyToClipboard(d.val)}>
              <CopyIcon />
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              onClick={async () => {
                setIsLoading(d => ({ ...d, delete: true }));
                await removeItem(d.id);
                updateData();
                setIsLoading(d => ({ ...d, delete: false }));
              }}
              isLoading={isLoading.delete}
            >
              <DeleteIcon />
            </Button>
          </GridItem>
          <GridItem colSpan={4}>
            <Textarea value={d.val} isReadOnly />
          </GridItem>
        </React.Fragment>
      ))}
    </LocalGrid>
}

export default ClipboardList;
