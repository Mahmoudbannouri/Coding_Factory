import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QuizService } from '../service/quiz/quiz.service';
import { Quiz } from '../model/exam/quiz';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  getAllQuizzes(): Promise<Quiz[]> {
    return this.quizService.getAllQuizzes().toPromise();
  }

  @Get(':id')
  getQuizById(@Param('id') id: number): Promise<Quiz> {
    return this.quizService.getQuizById(id).toPromise();
  }

  @Post('quiz/:examId')
  createQuiz(@Param('examId') examId: number, @Body() quiz: Quiz): Promise<Quiz> {
    return this.quizService.createQuiz(examId, quiz).toPromise();
  }

  @Put(':id')
  updateQuiz(@Param('id') id: number, @Body() quiz: Quiz): Promise<Quiz> {
    return this.quizService.updateQuiz(id, quiz).toPromise();
  }

  @Delete(':id')
  deleteQuiz(@Param('id') id: number): Promise<void> {
    return this.quizService.deleteQuiz(id).toPromise();
  }

  @Get('quiz/:examId')
  getQuizzesByExamId(@Param('examId') examId: number): Promise<Quiz[]> {
    return this.quizService.getQuizzesByExamId(examId).toPromise();
  }
}
