import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: any;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid Prompt ID';
      this.loading = false;
      return;
    }

    this.promptService.getPrompt(id).subscribe({
      next: (data) => {
        this.prompt = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Prompt not found or server error.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
