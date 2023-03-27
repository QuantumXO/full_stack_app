import { ReactElement } from 'react';
import { ITodo } from '@models/todo';
import { Box, Container, styled, Typography, Checkbox, Button } from '@mui/material';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import cx from 'classnames';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

export interface IProps extends ITodo { }

const Wrapper = styled('div')({
  padding: '12px 0',
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
  const { id, priority, position, title, content, createdAt } = props;
  return (
    <Draggable
      index={position}
      draggableId={id}
    >
      {(provided: DraggableProvided): ReactElement => {
        const { innerRef, draggableProps, dragHandleProps } = provided;
        return (
          <Wrapper
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            className={cx('todo', priority)}
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
                <Checkbox onChange={undefined}/>
                <Button color="inherit">
                  <DeleteIcon fontSize="large" />
                </Button>
              </Box>
            </div>
          </Wrapper>
        )
      }}
    </Draggable>
  );
}