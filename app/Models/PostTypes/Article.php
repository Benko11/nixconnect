<?php

namespace App\Models\PostTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = ['body', 'title'];
    public $timestamps = false;
    protected $table = 'posts_article';

    public function post() {
        return $this->morphOne(Post::class, 'postable');
    }
}
