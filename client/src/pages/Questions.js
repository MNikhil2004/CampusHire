import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import api from '../utils/axios';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: jobId } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/api/questions/job/${jobId}`);
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading questions...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Interview Questions
        </Typography>
        
        {questions.length === 0 ? (
          <Typography>No questions available for this job yet.</Typography>
        ) : (
          <List>
            {questions.map((question, index) => (
              <React.Fragment key={question._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6">
                          Q{index + 1}: {question.question}
                        </Typography>
                        <Chip 
                          label={question.type} 
                          color={question.type === 'technical' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      question.answer && (
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Answer: {question.answer}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < questions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Questions; 