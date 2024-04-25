import React from 'react';

import CreateBoardButton from '../../components/createBoard';
import Header from '../../components/header';
function HelloWorld() {
  return (
  <>
    <Header votesLeft={0}/>
    <CreateBoardButton/>

  </>
  )
}

export default HelloWorld;
