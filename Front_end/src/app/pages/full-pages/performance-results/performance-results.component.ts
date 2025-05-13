import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PerformanceResponse } from 'app/models/performance';
import { StudentPerformanceService } from 'app/services/student-performance.service';

@Component({
  selector: 'app-performance-results',
  templateUrl: './performance-results.component.html',
  styles: [`
    .probability-bar {
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .grade-badge {
      transition: all 0.3s ease;
    }
    .grade-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .donut-segment {
      animation: donut-fill 1s ease-out forwards;
    }
    @keyframes donut-fill {
      from { stroke-dasharray: 0 282.6; }
    }
    .fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PerformanceResultsComponent implements OnChanges {
  @Input() results!: PerformanceResponse;
  @Input() isLoading: boolean = false;
  
  probabilityItems: {label: string, value: number, color: string}[] = [];
  interpretation: string = '';

  // Map numeric predictions to labels
  private predictionLabels: {[key: string]: string} = {
    '1': 'Failed',
    '2': 'Passable',
    '3': 'Good',
    '4': 'Very Good',
    '5': 'Excellent'
  };

  // Color mapping for each grade
  private gradeColors: {[key: string]: string} = {
    'Failed': 'bg-red-500',
    'Passable': 'bg-yellow-500',
    'Good': 'bg-blue-500',
    'Very Good': 'bg-green-500',
    'Excellent': 'bg-purple-500'
  };

  constructor(private performanceService: StudentPerformanceService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.prepareProbabilityItems();
      this.interpretation = this.performanceService.getPerformanceInterpretation(
        this.getPredictionLabel(this.results.prediction)
      );
    }
  }

  private prepareProbabilityItems(): void {
    // Convert numeric probabilities to labeled ones if needed
    const probabilities = this.transformProbabilities(this.results.probabilities);
    
    this.probabilityItems = Object.entries(probabilities)
      .map(([label, value]) => ({
        label,
        value,
        color: this.gradeColors[label] || 'bg-gray-500'
      }))
      .sort((a, b) => b.value - a.value);
  }

  private transformProbabilities(probabilities: Record<string, unknown>): Record<string, number> {
    const hasNumericKeys = Object.keys(probabilities).some(key => !isNaN(Number(key)));
  
    if (hasNumericKeys) {
      const labeledProbabilities: Record<string, number> = {};
      for (const [key, value] of Object.entries(probabilities)) {
        const label = this.predictionLabels[key] || key;
        labeledProbabilities[label] = typeof value === 'number' ? value : Number(value);
      }
      return labeledProbabilities;
    }
  
    // Ensure all values are numbers
    const casted: Record<string, number> = {};
    for (const [key, value] of Object.entries(probabilities)) {
      casted[key] = typeof value === 'number' ? value : Number(value);
    }
    return casted;
  }
  getPredictionLabel(prediction: string): string {
    return this.predictionLabels[prediction] || prediction;
  }
  getProbabilityForPrediction(): number {
    const label = this.getPredictionLabel(this.results.prediction);
    return this.results.probabilities[label] || 0;
  }

  getPredictionColor(): string {
    const label = this.getPredictionLabel(this.results.prediction);
    return this.gradeColors[label] || 'bg-gray-500';
  }

  getColor(tailwindClass: string): string {
    const colorMap: {[key: string]: string} = {
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-purple-500': '#a855f7',
      'bg-gray-500': '#6b7280'
    };
    return colorMap[tailwindClass] || '#6b7280';
  }

  getDashArray(probability: number): string {
    const circumference = 2 * Math.PI * 45;
    const dashLength = probability * circumference;
    return `${dashLength} ${circumference}`;
  }

  getDashOffset(index: number): number {
    if (index === 0) return 25;
    let offset = 25;
    for (let i = 0; i < index; i++) {
      offset += this.probabilityItems[i].value * 282.6;
    }
    return offset;
  }

  getConfidenceLevel(): string {
    if (!this.results.confidence) return '';
    const confidence = this.results.confidence * 100;
    if (confidence >= 90) return 'Very High';
    if (confidence >= 70) return 'High';
    if (confidence >= 50) return 'Moderate';
    return 'Low';
  }
}