import React from 'react';


import { useContracts } from './participate/contracts-hook';

export const withContracts = (Component) => {
  return (props) => {
    const {
        contracts,
        addContract,
        setEntry,
        removeContract,
        findContract,
        getContract
    } = useContracts([])

    return <Component contracts={contracts} addContract={addContract} setEntry={setEntry} removeContract={removeContract} findContract={findContract} getContract={getContract} {...props} />;
  };
};
