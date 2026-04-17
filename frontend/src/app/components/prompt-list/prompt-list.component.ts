import { Component, OnInit } from '@angular/core';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  prompts: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private promptService: PromptService) { }

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load prompts. Please make sure the backend is running.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getComplexityClass(complexity: number): string {
    if (complexity <= 3) return 'complexity-low';
    if (complexity <= 7) return 'complexity-medium';
    return 'complexity-high';
  }
}
