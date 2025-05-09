import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatbotService } from 'app/services/Chatbot.service';
import { Router } from '@angular/router';
interface Question {
  key: keyof CourseModel;
  text: string;
  type: 'text' | 'number';
}

interface CourseModel {
  title: string;
  description: string;
  rating: number;
  reviewcount: number;
  duration: number;
  lectures: number;
}

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-knowledge-search',
  templateUrl: './knowledge-search.component.html',
  styleUrls: ['./knowledge-search.component.scss'],
  providers: [DatePipe]
})
export class KnowledgeSearchComponent implements OnInit {
  questions: Question[] = [
    { key: 'title', text: 'Titre du cours :', type: 'text' },
    { key: 'description', text: 'Description :', type: 'text' },
    { key: 'rating', text: 'Note moyenne (e.g. 4.6) :', type: 'number' },
    { key: 'reviewcount', text: 'Nombre avis :', type: 'number' },
    { key: 'duration', text: 'Durée (heures) :', type: 'number' },
    { key: 'lectures', text: 'Nombre de leçons :', type: 'number' },
  ];

  chat: ChatMessage[] = [];
  model = {} as CourseModel;

  currentIndex = 0;
  currentAnswer = '';
  currentType: 'text' | 'number' = 'text';

  finished = false;
  prediction: any;
  isTyping = false;
  showDetailedAnalysis = false;
  currentTime = new Date();
  chatbotService: any;
  currentFeedback: 'good' | 'bad' | null = null;
  isSaving = false;


  constructor(
    private courseService: ChatbotService,
    private datePipe: DatePipe,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.addBotMessage("Bonjour ! Je vais vous aider à prédire le niveau du cours. Quel est le titre du cours ?");
  }
 // Méthode pour définir le feedback
 setFeedback(type: 'good' | 'bad'): void {
  this.currentFeedback = type;
  this.addBotMessage(`Feedback enregistré: ${type === 'good' ? 'Bonne prédiction 👍' : 'Prédiction incorrecte 👎'}`);
}

  addBotMessage(text: string) {
    this.isTyping = true;
    setTimeout(() => {
      this.chat.push({ 
        from: 'bot', 
        text: text,
        timestamp: new Date()
      });
      this.isTyping = false;
    }, 1000);
  }

  addUserMessage(text: string) {
    this.chat.push({
      from: 'user',
      text: text,
      timestamp: new Date()
    });
  }

  sendAnswer() {
    if (this.currentAnswer.trim() === '') {
      return;
    }

    // Stocke la réponse convertie si nécessaire
    const q = this.questions[this.currentIndex];
    let value: string | number = this.currentAnswer;
    if (q.type === 'number') {
      value = parseFloat(this.currentAnswer);
    }
    (this.model as any)[q.key] = value;

    // Affiche la réponse de l'utilisateur
    this.addUserMessage(this.currentAnswer);

    this.currentAnswer = '';
    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      setTimeout(() => {
        this.addBotMessage(this.questions[this.currentIndex].text);
      }, 500);
    } else {
      // Toutes les questions sont terminées
      this.finished = true;
      this.analyzeUserLevel();
    }
  }

  analyzeUserLevel() {
    this.isTyping = true;
    
    this.courseService.predictCourseLevel(this.model).subscribe(
      res => {
        this.prediction = res;
        this.isTyping = false;
        this.addBotMessage("Voici les résultats de l'analyse du cours :");
      },
      err => {
        this.isTyping = false;
        this.addBotMessage('Erreur lors de la prédiction.');
      }
    );
  }

  toggleDetailedAnalysis() {
    this.showDetailedAnalysis = !this.showDetailedAnalysis;
  }

  getRatingEvaluation(rating: number): string {
    return rating >= 4 ? 'Excellent' : rating >= 3 ? 'Correct' : 'Faible';
  }

  getReviewCountEvaluation(count: number): string {
    return count > 1000 ? 'Élevé' : count > 100 ? 'Moyen' : 'Faible';
  }

  getDurationEvaluation(duration: number): string {
    return duration >= 20 ? 'Longue' : duration >= 5 ? 'Moyenne' : 'Courte';
  }

  getLecturesEvaluation(lectures: number): string {
    return lectures >= 100 ? 'Nombreuses' : lectures >= 30 ? 'Normales' : 'Peu';
  }





  // Dans knowledge-search.component.ts
saveConversation(prediction: any): void {
  if (!this.currentFeedback) {
    this.addBotMessage("Veuillez d'abord donner un feedback (👍 ou 👎)");
    return;
  }

  this.isSaving = true;
  
  const chatHistory = {
    conversation: this.chat.map(msg => `${msg.from}: ${msg.text}`).join('\n'),
    predictedLevel: prediction.predicted_level,
    popularityScore: prediction.popularity_probability,
    feedback: this.currentFeedback === 'good' ? 'good' : 'bad',
    createdAt: new Date()
  };

  this.courseService.saveChatHistory(chatHistory)
    .subscribe({
      next: () => {
        this.addBotMessage("Conversation enregistrée avec succès !");
        this.isSaving = false;
      },
      error: (err) => {
        console.error("Erreur d'enregistrement:", err);
        this.addBotMessage("Erreur lors de l'enregistrement");
        this.isSaving = false;
      }
    });
}




// Dans knowledge-search.component.ts
// knowledge-search.component.ts
navigateToHistory() {
  console.log('Tentative de navigation vers history');
  
  // Solution robuste avec fallback
  this.router.navigate(['/pages/kb/history'])
    .then(success => {
      if (!success) {
        console.warn('Navigation Angular a échoué, tentative de rechargement');
        window.location.href = '/pages/kb/history';
      }
    })
    .catch(err => {
      console.error('Erreur de navigation:', err);
      window.location.href = '/pages/kb/history';
    });
}
}