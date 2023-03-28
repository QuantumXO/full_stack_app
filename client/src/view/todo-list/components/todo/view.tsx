import { ReactElement } from 'react';
import { ITodo } from '@models/todo';
import { Box, styled, Typography, Checkbox, Button } from '@mui/material';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import cx from 'classnames';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';

export interface IProps extends ITodo {
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const Wrapper = styled('div')({
  padding: '12px 0 12px 24px',
  backgroundColor: '#ffffff',
  borderBottom: '2px solid transparent',
  '&.low': {
    borderBottomColor: '#eaeaea',
  },
  '&.medium': {
    borderBottomColor: '#ff9800',
  },
  '&.high': {
    borderBottomColor: '#ef5350',
  },
});

const PriorityIcon = styled('span')({
  width: 24,
  height: 24,
  display: 'inline-block',
  borderRadius: '50%',
  '&.low': {
    backgroundColor: '#eaeaea',
  },
  '&.medium': {
    backgroundColor: '#ff9800',
  },
  '&.high': {
    backgroundColor: '#ef5350',
  },
});

export function Todo(props: IProps): ReactElement {
  const { id, priority, index, title, content, createdAt, onSelect, isSelected, onDelete } = props;
  
  function onHandleSelect(): void {
    onSelect(id);
  }
  
  function onHandleDelete() {
    onDelete(id);
  }
  
  return (
    <Draggable
      index={index}
      draggableId={id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot): ReactElement => {
        const { innerRef, draggableProps, dragHandleProps } = provided;
        return (
          <Wrapper
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
            className={cx(
              'todo', priority,
              { dragging: snapshot.isDragging }
            )}
          >
            <div>
              <Typography
                paragraph
                style={{
                  marginBottom: 0,
                  color: '#757575',
                  fontSize: 12,
                  fontWeight: 700
              }}
              >
                {`${moment(createdAt).format('MMM Do')}`}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <PriorityIcon className={priority}/>
              <Box style={{ flex: 1 }}>
                <Typography variant="h4">{title}</Typography>
                <Typography
                  paragraph
                  style={{ marginBottom: 0 }}
                >
                  {content}
                </Typography>
              </Box>
              <Box
                className="actions"
                style={{
                  display: 'inline-flex'
                }}
              >
                <Button color="inherit" onClick={undefined}>
                  <EditIcon fontSize="medium" />
                </Button>
                <Button color="inherit" onClick={onHandleDelete}>
                  <DeleteIcon fontSize="medium" />
                </Button>
                <Checkbox checked={isSelected} onChange={onHandleSelect}/>
              </Box>
            </div>
          </Wrapper>
        )
      }}
    </Draggable>
  );
}