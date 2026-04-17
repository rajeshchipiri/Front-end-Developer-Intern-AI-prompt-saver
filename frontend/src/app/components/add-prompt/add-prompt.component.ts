import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css']
})
export class AddPromptComponent implements OnInit {
  promptForm: FormGroup;
  submitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.promptForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      this.promptService.createPrompt(this.promptForm.value).subscribe({
        next: () => {
          this.router.navigate(['/prompts']);
        },
        error: (err) => {
          if (err.error && err.error.errors) {
            this.errorMessage = Object.values(err.error.errors).join(' ');
          } else {
            this.errorMessage = 'Failed to create prompt. Please check backend connection.';
          }
          this.submitting = false;
        }
      });
    } else {
      this.promptForm.markAllAsTouched();
    }
  }
}
