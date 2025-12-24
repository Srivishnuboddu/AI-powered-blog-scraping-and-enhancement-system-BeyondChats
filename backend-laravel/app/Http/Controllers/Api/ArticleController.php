<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // GET /api/articles
    public function index()
    {
        return response()->json(
            Article::orderBy('created_at', 'desc')->get()
        );
    }

    // GET /api/articles/{id}
    public function show($id)
    {
        return response()->json(
            Article::findOrFail($id)
        );
    }

    // POST /api/articles
    public function store(Request $request)
    {
        $article = Article::create([
            'title' => $request->title,
            'content' => $request->content,
            'source_url' => $request->source_url,
            'type' => $request->type ?? 'original',
        ]);

        return response()->json($article, 201);
    }

    // PUT /api/articles/{id}
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $article->update($request->all());

        return response()->json($article);
    }

    // DELETE /api/articles/{id}
    public function destroy($id)
    {
        Article::findOrFail($id)->delete();

        return response()->json(['message' => 'Article deleted']);
    }
}
