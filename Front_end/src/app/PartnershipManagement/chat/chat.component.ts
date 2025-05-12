import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { ChatService } from './chat.service';
import { ScrapingService } from 'app/PartnershipManagement/services/scraping.service';
import { ConfigService } from 'app/shared/services/config.service';
import { Chat, UsersChat } from './chat.model';
import { ToastrService } from 'ngx-toastr';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  isThinking: boolean = false;
  newMessage: string = '';
  filteredSuggestions: string[] = [];
  showSuggestions: boolean = false;
  scrapedCompaniesExist: boolean = false;
  predictionsExist: boolean = false;
  allSuggestions: string[] = [
    "Predict all",
    "List eligible companies",
    "Show statistics",
    "Compare Zensai and CertCentral",
    "What is the eligibility breakdown?",
    "Is Zensai eligible?",
    "Which is better for partnership: Zensai or CertCentral?",
    "Who is more eligible between Zensai and CertCentral?",
    "Is Zensai better than CertCentral?",
    "Partnership comparison between Zensai and CertCentral",
    "Clear all predictions",
    "Reset eligibility predictions",
    "Start over with predictions",
    "Remove all prediction data",
    "Reset data",
    "Clear predictions",
    "Show me statistics",
    "Eligibility summary",
    "Give me some stats",
    "Overall eligibility status",
    "How many companies are eligible?",
    "Summarize the eligibility"
  ];

  chats: Chat[] = [];
  usersChat: UsersChat[] = [];
  activeChat: UsersChat;
  activeChatUser = '';
  activeChatUserImg = '';
  loggedInUserImg = 'assets/img/portrait/small/avatar-s-1.png';
  searchQuery = '';
  placement = 'bottom-right';
  isContentOverlay = false;
  config: any = {};
  layoutSub: Subscription;
  item = 0;

  eligibleCompanies = 0;
  nonEligibleCompanies = 0;
  chartData: any;
  chartOptions: any;
  private renderedCharts = new Set<string>();

  // Array of witty responses for "Hey"
  private wittyResponses: string[] = [
    "Hey there! 👋 How can I brighten your day?",
    "Hello! 🌞 Ready to chat?",
    "Hi! 😊 What's on your mind?",
    "Hey! 🚀 How can I assist you today?",
    "Greetings! 🌟 What can I do for you?",
    "Hi there! 🤖 How can I make your day better?",
    "Hello! 🌈 How can I help you today?",
    "Hey! 🌟 Ready to make things happen?"
  ];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private chatService: ChatService,
    private scrapingService: ScrapingService,
    private toastr: ToastrService, // Inject toastr service

  ) {
    this.config = this.configService.templateConf;
    this.usersChat = chatService.usersChat;
    this.activeChat = this.usersChat.find(u => u.isActiveChat)!;
    this.chats = this.activeChat.chats;
    this.activeChatUser = this.activeChat.name;
    this.activeChatUserImg = this.activeChat.avatar;
    this.renderer.addClass(this.document.body, 'chat-application');
  }

  // Function to convert chat data into CSV
  convertChatToCSV(): string {
    const header = ['Sender', 'Message', 'Time'];
    const rows = this.chats.map(chat => {
      const sender = chat.isReceived ? 'Bot' : 'User';
      const message = chat.messages.join(' ');
      const time = chat.time;
      return [sender, message, time].join(',');
    });

    return [header.join(','), ...rows].join('\n');
  }

  // Trigger the download of the CSV file
  downloadCSV() {
    const csvData = this.convertChatToCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'chat_export.csv');
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  ngOnInit() {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`
          }
        }
      }
    };

    // Load chat history from localStorage if it exists
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      this.chats = JSON.parse(savedChatHistory);  // Parse the stored chat history
      this.activeChat.chats = this.chats;  // Make sure the active chat also has the history
    }
  }

  ngAfterViewChecked() {
    this.renderChartsIfNeeded();
  }

  ngOnDestroy() {
    if (this.layoutSub) this.layoutSub.unsubscribe();
    this.renderer.removeClass(this.document.body, 'chat-application');
  }

  onMessageChange() {
    this.filteredSuggestions = this.getSuggestions();
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  getSuggestions() {
    if (this.newMessage.trim() === '') return [];
    return this.allSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(this.newMessage.toLowerCase())
    );
  }

  selectSuggestion(suggestion: string) {
    this.newMessage = suggestion;
    this.showSuggestions = false;
  }

  onAddMessage() {
    if (this.newMessage.trim()) {
      // Add the user's message to the chat history
      const userMessage = {
        isReceived: false,
        time: this.getCurrentTime(),
        messages: [this.newMessage],
        messageType: 'text'
      };
      this.chats.push(userMessage);

      // Save only the necessary information to localStorage
      this.saveChatHistory();

      // Process the message (send it to the bot, or handle it as needed)
      this.processMessage(this.newMessage.trim());

      // Clear the message input after sending
      this.newMessage = '';

      // Trigger change detection to update the UI (if necessary)
      this.cdr.detectChanges();
    }
  }

  clearChatHistory() {
    // Clear the chat history from the component
    this.chats = [];
    this.activeChat.chats = []; // Ensure the active chat also gets cleared
  
    // Clear chat history from localStorage
    localStorage.removeItem('chatHistory');
  
    // Reset state variables
    this.predictionsExist = false;
    this.scrapedCompaniesExist = false;
    this.eligibleCompanies = 0;
    this.nonEligibleCompanies = 0;
  
    // Add a message to indicate that the chat has been cleared
    this.chats.push(this.buildTextMsg("Chat history has been cleared. You can start a new conversation."));
  
    // Add the "Hey" message after clearing the history
    this.chats.push(this.buildTextMsg("Hey! How can I assist you today?"));
  
    // Trigger the witty response for the "Hey" message
    this.processMessage("hey");
  
    // Save the state after clearing
    this.saveChatHistory();
  
    // Trigger the reload animation
    this.renderer.addClass(this.document.body, 'reload-animation');
    setTimeout(() => {
      this.renderer.removeClass(this.document.body, 'reload-animation');
    }, 500); // Remove the class after the animation duration
  
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  
    // Force a re-render of the chat interface
    this.chats = [...this.chats];
    

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 500);
    }
  
  
  
  private saveChatHistory() {
    const simplifiedChats = this.chats.map(chat => ({
      isReceived: chat.isReceived,
      time: chat.time,
      messages: chat.messages,
      messageType: chat.messageType
    }));
    localStorage.setItem('chatHistory', JSON.stringify(simplifiedChats));
  }

  private runPrediction() {
    const thinkingMsg = {
      isReceived: true,
      time: '',
      messages: ['Running prediction model...'],
      messageType: 'text'
    };
    this.chats.push(thinkingMsg);
    this.saveChatHistory();
    this.cdr.detectChanges();

    this.scrapingService.predictAll().subscribe({
      next: (response) => {
        this.removeMessage(thinkingMsg);
        this.predictionsExist = true;
        this.scrapedCompaniesExist = response?.scrapedCompaniesReady ?? true;

        this.chats.push({
          isReceived: true,
          time: this.getCurrentTime(),
          messages: ['Prediction complete! 🎉 You can now ask for stats or eligible companies.'],
          messageType: 'text'
        });
        this.saveChatHistory();
        this.cdr.detectChanges();
      },
      error: () => {
        this.removeMessage(thinkingMsg);
        this.showError("Oops! Prediction failed. Please try again. 😕");
        this.saveChatHistory();
        this.cdr.detectChanges();
      }
    });
  }

  private processMessage(message: string) {
    if (/^hey$/i.test(message)) {
      const randomIndex = Math.floor(Math.random() * this.wittyResponses.length);
      this.chats.push(this.buildTextMsg(this.wittyResponses[randomIndex]));
      this.saveChatHistory();
      this.cdr.detectChanges();
      return;
    }
  
    if (/^good bye$/i.test(message)) {
      this.chats.push(this.buildTextMsg("Alright, going back to training to help you better next time 😉"));
      this.saveChatHistory();
      this.cdr.detectChanges();
      return;
    }
  
    if (/^save as csv$/i.test(message)) {
      this.downloadCSV();
      this.chats.push(this.buildTextMsg("Your chat has been saved as a CSV file."));
      this.saveChatHistory();
      this.cdr.detectChanges();
      return;
    }
  
    if (/^clear chat history$/i.test(message)) {
      this.clearChatHistory();
      this.chats.push(this.buildTextMsg("Chat history has been cleared."));
      this.saveChatHistory();
      this.cdr.detectChanges();
      return;
    }
  
    const wantsStats = /statistics|breakdown|stats|chart/i.test(message);
    const wantsEligibleCompaniesList = /list eligible companies/i.test(message);
    const wantsComparison = /compare (.+) and (.+)/i.test(message);
    const wantsPrediction = /predict all/i.test(message);
  
    const thinkingMsg = {
      isReceived: true,
      time: '',
      messages: ['...thinking'],
      messageType: 'text'
    };
  
    this.isThinking = true;
    this.cdr.detectChanges();
  
    if (!this.predictionsExist && !wantsPrediction) {
      this.chats.push({
        isReceived: true,
        time: this.getCurrentTime(),
        messages: ['Please run the prediction model first to find out the eligible companies.'],
        messageType: 'text'
      });
      this.saveChatHistory();
      this.isThinking = false;
      this.cdr.detectChanges();
      return;
    }
  
    if (this.predictionsExist && !this.scrapedCompaniesExist && !wantsPrediction) {
      this.chats.push({
        isReceived: true,
        time: this.getCurrentTime(),
        messages: ['Please let me scrape the web first to gather company information.'],
        messageType: 'text'
      });
      this.saveChatHistory();
      this.isThinking = false;
      this.cdr.detectChanges();
      return;
    }
  
    if (wantsPrediction) {
      this.runPrediction();
      return;
    }
  
    this.chats.push(thinkingMsg);
    this.saveChatHistory();
    this.cdr.detectChanges();
  
    if (wantsComparison) {
      const match = message.match(/compare (.+) and (.+)/i);
      if (match) {
        const company1 = match[1].trim();
        const company2 = match[2].trim();
        this.scrapingService.compareCompanies(company1, company2).subscribe({
          next: (response) => {
            this.removeMessage(thinkingMsg);
            this.handleComparisonResponse(response);
            this.saveChatHistory();
            this.isThinking = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.removeMessage(thinkingMsg);
            this.showError("Sorry, I couldn't process your request. Please try again.");
            this.saveChatHistory();
            this.isThinking = false;
            this.cdr.detectChanges();
          }
        });
        return;
      }
    }
  
    this.scrapingService.askQuestion(message).subscribe({
      next: (response) => {
        this.removeMessage(thinkingMsg);
        this.handleApiResponse(response, wantsStats, wantsEligibleCompaniesList);
        this.saveChatHistory();
        this.isThinking = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.removeMessage(thinkingMsg);
        this.showError("Sorry, I couldn't process your request. Please try again.");
        this.saveChatHistory();
        this.isThinking = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  onResetClick() {
    this.predictionsExist = false;
    this.scrapedCompaniesExist = false;
    this.eligibleCompanies = 0;
    this.nonEligibleCompanies = 0;

    this.chats.push({
      isReceived: true,
      time: this.getCurrentTime(),
      messages: ['Predictions were reset. Please run the prediction model again to find out the eligible companies.'],
      messageType: 'text'
    });
    this.saveChatHistory();
  }

  private handleComparisonResponse(response: any) {
    if (!response || !response.companies || response.companies.length < 2) {
      this.chats.push(this.buildTextMsg("Hmm, I couldn't find enough data to compare. 🤔"));
      this.saveChatHistory();
      return;
    }

    this.chats.push(this.buildTextMsg(response.answer));
    this.chats.push({
      isReceived: true,
      time: this.getCurrentTime(),
      messages: [`chart-${Date.now()}`],
      messageType: 'chart',
      chartData: {
        labels: ['Rating', 'Review Count', 'Eligibility Percentage'],
        datasets: [
          {
            label: response.companies[0].name,
            data: [
              response.companies[0].rating,
              response.companies[0].review_count,
              response.companies[0].eligibility_percentage
            ],
            backgroundColor: '#36A2EB',
          },
          {
            label: response.companies[1].name,
            data: [
              response.companies[1].rating,
              response.companies[1].review_count,
              response.companies[1].eligibility_percentage
            ],
            backgroundColor: '#FF6384',
          }
        ],
        type: 'bar'
      }
    });
    this.chats.push(this.buildTextMsg(`The better company is: ${response.better_company} 🏆`));
    this.saveChatHistory();
    if (response.suggestion) {
      this.chats.push({
        isReceived: true,
        time: '',
        messages: [response.suggestion],
        messageType: 'suggestion'
      });
      this.saveChatHistory();
    }
  }

  private handleApiResponse(response: any, wantsChart: boolean, wantsEligibleList: boolean) {
    const companies = response.companies || [];

    if (companies.length > 0) {
      this.predictionsExist = true;

      const eligibleCompanies = companies.filter(company => {
        const score = parseFloat(company.eligibility?.replace('%', '') || '0');
        return score > 50;
      });

      this.eligibleCompanies = eligibleCompanies.length;
      this.nonEligibleCompanies = companies.length - this.eligibleCompanies;

      if (eligibleCompanies.length > 0 && wantsEligibleList) {
        this.activeChat.chats.push(this.buildTextMsg("Here are the crème de la crème of eligible companies: 🌟"));
        const top5 = eligibleCompanies.slice(0, 5);
        top5.forEach(company => {
          const d = company.details || {};
          const detailMsg = `Company: ${company.name}
Rating: ${d.average_rating || company.rating || 'N/A'} ★
Technologies: ${company.keywords ? company.keywords.join(', ') : 'N/A'}
Total Reviews: ${d.total_reviews || company.reviews || 'N/A'}
Eligibility Score: ${company.eligibility}`;
          this.activeChat.chats.push({ isReceived: true, time: this.getCurrentTime(), messages: [detailMsg], messageType: 'company' });
        });

        if (eligibleCompanies.length > 5) {
          this.activeChat.chats.push({
            isReceived: true,
            time: this.getCurrentTime(),
            messages: ["Click below to see more companies. 👇"],
            messageType: 'button',
            buttonText: "See More",
            buttonAction: () => this.showMoreCompanies(eligibleCompanies)
          });
        }

        this.activeChat.chats.push({
          isReceived: true,
          time: this.getCurrentTime(),
          messages: [response.suggestion || "Would you like to see who's not eligible? 😏"],
          messageType: 'suggestion'
        });
      }

      if (wantsChart) {
        this.sendChartResponse("Here's the eligibility breakdown: 📊");
      }
    } else if (response.chart_data) {
      this.activeChat.chats.push(this.buildTextMsg(response.answer || "Here's the statistics breakdown: 📈"));
      this.activeChat.chats.push({
        isReceived: true,
        time: this.getCurrentTime(),
        messages: [`chart-${Date.now()}`],
        messageType: 'chart',
        chartData: response.chart_data
      });
    } else {
      this.activeChat.chats.push(this.buildTextMsg(response.answer || 'No information available. 🤷‍♂️'));
    }

    this.saveChatHistory();

    if (response.suggestion) {
      this.activeChat.chats.push({
        isReceived: true,
        time: this.getCurrentTime(),
        messages: [response.suggestion],
        messageType: 'suggestion'
      });
      this.saveChatHistory();
    }
  }

  private showMoreCompanies(eligibleCompanies: any[]) {
    eligibleCompanies.slice(5).forEach(company => {
      const d = company.details || {};
      const detailMsg = `Company: ${company.name}
Rating: ${d.average_rating || 'N/A'} ★
Technologies: ${company.keywords ? company.keywords.join(', ') : 'N/A'}
Total Reviews: ${d.total_reviews || 'N/A'}
Eligibility Score: ${company.eligibility}`;
      this.activeChat.chats.push({ isReceived: true, time: this.getCurrentTime(), messages: [detailMsg], messageType: 'company' });
    });

    this.activeChat.chats.push(this.buildTextMsg("You've seen all the eligible companies."));
    this.saveChatHistory();
  }

  private sendChartResponse(message: string) {
    this.updateChartData();
    this.chats.push(this.buildTextMsg(message));
    this.chats.push({
      isReceived: true,
      time: this.getCurrentTime(),
      messages: [`chart-${Date.now()}`],
      messageType: 'chart',
      chartData: {
        labels: ['Eligible', 'Non-Eligible'],
        datasets: [{
          data: [this.eligibleCompanies, this.nonEligibleCompanies],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }],
        type: 'pie'
      }
    });
    this.saveChatHistory();
  }

  private updateChartData() {
    this.chartData = {
      labels: ['Eligible', 'Non-Eligible'],
      datasets: [{
        data: [this.eligibleCompanies, this.nonEligibleCompanies],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }]
    };
  }

  private renderChartsIfNeeded() {
    setTimeout(() => {
      this.chats
        .filter(chat => chat.messageType === 'chart')
        .forEach(chat => {
          const chartId = chat.messages[0];
          if (!this.renderedCharts.has(chartId)) {
            const canvas = document.getElementById(chartId) as HTMLCanvasElement;
            if (canvas && chat.chartData) {
              new Chart(canvas, {
                type: chat.chartData.type || 'bar',
                data: {
                  labels: chat.chartData.labels || [],
                  datasets: chat.chartData.datasets || []
                },
                options: this.chartOptions
              });
              this.renderedCharts.add(chartId);
            }
          }
        });
    }, 100);
  }

  private removeMessage(msg: Chat) {
    const index = this.chats.indexOf(msg);
    if (index !== -1) this.chats.splice(index, 1);
    this.saveChatHistory();
  }

  private buildTextMsg(message: string): Chat {
    return {
      isReceived: true,
      time: this.getCurrentTime(),
      messages: [message],
      messageType: 'text'
    };
  }

  private showError(msg: string) {
    this.chats.push(this.buildTextMsg(msg));
    this.saveChatHistory();
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
