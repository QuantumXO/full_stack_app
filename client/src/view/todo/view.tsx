import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { getResponseData, httpRequest } from '@services/common/axios';
import { Box, Container, Typography, Chip, Input, InputLabel, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TodoItem from './components/todo';
import { ITodo } from '@models/todo';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import isOkResponse from '@services/common/is-ok-response';

export function Todo(): ReactElement {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [search, handleSearch] = useState<string>('');
  
  useEffect((): void => {
    getTodos();
  }, []);
  
  async function getTodos() {
    const res = await httpRequest({
      method: 'GET',
      url: '/todos',
    });
    
    if (isOkResponse(res)) {
      const { todos } = getResponseData(res);
      setTodos(todos as ITodo[]);
    }
  }
  
  function onSearch(e: ChangeEvent<HTMLInputElement>): void {
    handleSearch(e.target.value);
  }
  
  function onDragEnd(result: unknown) {
    console.log('result: ', result);
  }
  
  function renderInfo(): ReactElement {
    return (
      <Container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <Chip label={`Total: 0`} color="primary"/>
        <Chip label={`Complete: 0`} color="success"/>
        <Chip label={`Pending: 0`} color="warning"/>
      </Container>
    );
  }
  
  function renderSearch(): ReactElement {
    return (
      <Container
        style={{
          marginTop: 25,
        }}
      >
        <FormControl style={{ width: '100%', }}>
          <InputLabel htmlFor="searchInput">{'Find todo...'}</InputLabel>
          <Input
            value={search}
            id="searchInput"
            onChange={onSearch}
            aria-describedby="my-helper-text"
          />
        </FormControl>
      </Container>
    );
  }
  
  function renderTodosList(): ReactElement {
    return (
      <Container
        style={{
          marginTop: 15,
          // border: '1px solid #eaeaea',
        }}
      >
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <Droppable droppableId="0">
            {(provided: DroppableProvided): ReactElement => {
              const { innerRef, droppableProps, placeholder } = provided;
              return (
                <div
                  ref={innerRef}
                  {...droppableProps}
                >
                  {todos.map((item: ITodo): ReactElement => {
                    return (
                      <TodoItem key={item.id} {...item} />
                    );
                  })}
                  {placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </Container>
    );
  }
  
  return (
    <Box className="home" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        {t('To do list')}
      </Typography>
      <Container
        maxWidth="md"
        component="main"
        style={{ marginTop: 35 }}
      >
        {renderInfo()}
        {renderSearch()}
        {renderTodosList()}
      </Container>
    </Box>
  );
}