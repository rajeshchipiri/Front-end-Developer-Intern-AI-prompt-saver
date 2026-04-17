import redis
import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Prompt

# Get redis config from settings or environment
REDIS_HOST = getattr(settings, 'REDIS_HOST', 'localhost')
REDIS_PORT = getattr(settings, 'REDIS_PORT', 6379)

try:
    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=0,
        decode_responses=True
    )
except Exception:
    r = None

@csrf_exempt
def prompt_list_create(request):
    if request.method == "GET":
        prompts = list(Prompt.objects.all().values("id", "title", "complexity", "created_at"))
        return JsonResponse(prompts, safe=False)
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title", "").strip()
            content = data.get("content", "").strip()
            complexity = data.get("complexity")
            
            # Backend Validation
            errors = {}
            if len(title) < 3:
                errors["title"] = "Title must be at least 3 characters."
            if len(content) < 20:
                errors["content"] = "Content must be at least 20 characters."
            try:
                comp_val = int(complexity)
                if not (1 <= comp_val <= 10):
                    errors["complexity"] = "Complexity must be between 1 and 10."
            except (ValueError, TypeError):
                errors["complexity"] = "Complexity must be an integer between 1 and 10."
                
            if errors:
                return JsonResponse({"errors": errors}, status=400)
            
            prompt = Prompt.objects.create(
                title=title,
                content=content,
                complexity=int(complexity)
            )
            return JsonResponse({
                "id": prompt.id,
                "title": prompt.title,
                "complexity": prompt.complexity,
                "created_at": prompt.created_at
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def prompt_detail(request, prompt_id):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
        
    try:
        prompt = Prompt.objects.get(id=prompt_id)
        
        # Redis View Counter
        view_count = 0
        if r:
            try:
                key = f"prompt:{prompt_id}:views"
                view_count = r.incr(key)
            except Exception:
                # Fallback if Redis is down
                view_count = "N/A"
        
        return JsonResponse({
            "id": prompt.id,
            "title": prompt.title,
            "content": prompt.content,
            "complexity": prompt.complexity,
            "created_at": prompt.created_at,
            "view_count": view_count
        })
    except Prompt.DoesNotExist:
        return JsonResponse({"error": "Prompt not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
