<?php

namespace App\Models\PostTypes;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Text extends Model
{
    use HasFactory;

    protected $table = 'posts_text';
    protected $fillable = ['contents'];
    public $timestamps = false;

    public function post() {
        return $this->morphOne(Post::class, 'postable');
    }
}
