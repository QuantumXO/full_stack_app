import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { getResponseData, httpRequest } from '@services/common/axios';
import { Button, Chip, Container, FormControl, Input, InputLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TodoItem from './components/todo';
import { ITodo } from '@models/todo';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from 'react-beautiful-dnd';
import isOkResponse from '@services/common/is-ok-response';
import SearchIcon from '@mui/icons-material/Search';
import cx from 'classnames';
import _ from 'lodash';

import './styles.scss';

interface ITodosInfo {
  totalCount?: number;
  completeCount?: number;
  pendingCount?: number;
}

export function Todos(): ReactElement {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [search, handleSearch] = useState<string>('');
  const [selectedTodos, handleSelectTodo] = useState<string[]>([]);
  const [todosInfo, setTodosInfo] = useState<ITodosInfo>({});
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>(todos);
  
  useEffect((): void => {
    getTodos();
  }, []);
  
  useEffect((): void => {
    onFilterTodosBySearch();
  }, [JSON.stringify(todos)]);
  
  async function getTodos() {
    const res = await httpRequest({
      method: 'GET',
      url: '/todos',
    });
    
    if (isOkResponse(res)) {
      const { todos: responseTodos, totalCount = 0, completeCount = 0, pendingCount = 0 } = getResponseData(res);
      setTodos(responseTodos as ITodo[]);
      setTodosInfo({
        totalCount: totalCount as number,
        completeCount: completeCount as number,
        pendingCount: pendingCount as number,
      });
    }
  }
  
  const onFilterTodosBySearch = (searchArg: string = search): void => {
    const searchValue: string = searchArg.trim().toLowerCase();
    let newTodos: ITodo[] = todos;
    
    if (!!searchValue.length) {
      newTodos = todos.filter(({ title, content }: ITodo) => {
        return title.toLowerCase().includes(searchValue) || content.toLowerCase().includes(searchValue);
      });
    }
    setFilteredTodos(newTodos);
  };
  
  const debouncedFilterBySearch = useCallback(
    _.debounce(onFilterTodosBySearch, 300),
    [JSON.stringify(todos)]
  );
  
  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    handleSearch(value);
    debouncedFilterBySearch(value);
  }
  
  function onDragEnd(dropResult: DropResult): void {
    const { destination, source } = dropResult;
    if (destination) {
      // If changed position
      if (destination.index !== source.index) {
        onDragEndHandleTodoPosition(dropResult);
      }
    }
  }
  
  function onDragEndHandleTodoPosition(dropResult: DropResult): void {
    const { source, destination } = dropResult;
  
    const todosItems: ITodo[] = Array.from(todos);
    const [reorderedItem] = todosItems.splice(source.index, 1);
  
    todosItems.splice(destination!.index, 0, reorderedItem);
  
    setTodos(todosItems);
  }
  
  function onHandleSelectTodo(id: string): void {
    handleSelectTodo((prevState: string[]): string[] => {
      const isSelected: boolean = prevState.findIndex((prevId: string) => prevId === id) !== -1;
      return isSelected
        ? prevState.filter((prevId: string) => id !== prevId)
        : [...prevState, id];
    });
  }
  
  function onDeleteTodo(id: string): void {
    console.log(`onDeleteTodo() ${id}`);
  }
  
  function renderInfo(): ReactElement {
    const { pendingCount = 0, totalCount = 0, completeCount = 0 } = todosInfo;
    return (
      <Container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <Chip label={`Total: ${totalCount}`} color="primary"/>
        <Chip label={`Complete: ${completeCount}`} color="success"/>
        <Chip label={`Pending: ${pendingCount}`} color="warning"/>
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
        <FormControl
          style={{
            width: '100%',
            position: 'relative',
            // display: 'flex',
            // flexDirection: 'row',
            // justifyContent: 'space-between',
          }}
        >
          <InputLabel htmlFor="searchInput">{'Find todo...'}</InputLabel>
          <Input
            value={search}
            id="searchInput"
            aria-describedby="my-helper-text"
            style={{
              width: '100%',
            }}
            onChange={onSearch}
          />
          <Button
            color="inherit"
            style={{
              top: 'calc(50%)',
              right: 0,
              position: 'absolute',
              transform: 'translateY(-50%)'
            }}
          >
            <SearchIcon fontSize="medium"/>
          </Button>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            type="column"
            droppableId="0"
            direction="vertical"
          >
            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot): ReactElement => {
              const { innerRef, droppableProps, placeholder } = provided;
              return (
                <div
                  {...droppableProps}
                  ref={innerRef}
                  className={cx({ 'dragging--over': snapshot.isDraggingOver })}
                >
                  {filteredTodos.map((item: ITodo, index: number): ReactElement => {
                    const { id } = item;
                    const isSelected: boolean = selectedTodos.includes(id);
                    return (
                      <TodoItem
                        {...item}
                        key={id}
                        index={index}
                        isSelected={isSelected}
                        onDelete={onDeleteTodo}
                        onSelect={onHandleSelectTodo}
                      />
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
    <Container className="todo--list page">
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
    </Container>
  );
}