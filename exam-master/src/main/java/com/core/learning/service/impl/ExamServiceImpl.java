package com.core.learning.service.impl;

import com.core.learning.DTO.ExamsDTO;
import com.core.learning.DTO.QuizDTO;
import com.core.learning.model.Evaluation;
import com.core.learning.model.Exam;
import com.core.learning.model.Quiz;
import com.core.learning.repository.EvaluationReapository;
import com.core.learning.repository.ExamReapository;
import com.core.learning.repository.QuizRepository;
import com.core.learning.service.CertificationService;
import com.core.learning.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamReapository examRepository;
    @Autowired
    private EvaluationReapository evaluationRepository;
    @Autowired
    private QuizRepository quizRepository;
    
        private final CertificationService certificateService;

        @Autowired
        public ExamServiceImpl(CertificationService certificateService) {
            this.certificateService = certificateService;
        }



    @Override
    public List<ExamsDTO> getAllExams() {
        return examRepository.findAll().stream().map(exam -> new ExamsDTO(
                exam.getId(),
                exam.getTitle(),
                exam.getDescription(),
                exam.getChrono(),
                exam.getQuestionCount(),
                exam.getQuizzes().stream().map(quiz -> new QuizDTO(quiz
                     
                )).collect(Collectors.toList()))
           
        ).collect(Collectors.toList());
    }

    @Override
    public Optional<Exam> getExamById(Long id) {
        return examRepository.findById(id);
    }

    @Override
    public Exam addExam(Exam exam) {
        return examRepository.save(exam);
    }

    @Override
    public Exam updateExam(Long id, Exam updatedExam) {
        return examRepository.findById(id).map(exam -> {
            exam.setTitle(updatedExam.getTitle());
            exam.setDescription(updatedExam.getDescription());
            exam.setChrono(updatedExam.getChrono());
            exam.setQuestionCount(updatedExam.getQuestionCount());
            return examRepository.save(exam);
        }).orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    @Override
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }
    
    @Override
    public void completeExam(Long examId, Long userId, List<String> selectedAnswers, String username, String examTitle) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        int correctAnswers = 0;
        List<Quiz> quizzes = quizRepository.findByExamId(examId);

        if (quizzes.size() != selectedAnswers.size()) {
            throw new RuntimeException("Number of answers doesn't match number of questions");
        }

        for (int i = 0; i < quizzes.size(); i++) {
            Quiz quiz = quizzes.get(i);
            if (quiz.getCorrectOption().equals(selectedAnswers.get(i))) {
                correctAnswers++;
            }
        }

        int score = (correctAnswers * 100) / quizzes.size();

        Evaluation evaluation = new Evaluation();
        evaluation.setExam(exam);
        evaluation.setUserId(userId);
        evaluation.setScore(score);

        evaluationRepository.save(evaluation);

        if (score > 50) {
            boolean certificateExists = certificateService.certificateExists(userId, examId);
            if (!certificateExists) {
                certificateService.createCertificate(userId, examId, username, examTitle, score, score);
            }
        }
    }

    private void generateCertificate(Long userId, Long examId, int score) {
    }

}
