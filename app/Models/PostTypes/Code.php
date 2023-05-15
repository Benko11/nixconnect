<?php

namespace App\Models\PostTypes;

use App\Models\CodeLanguage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Code extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'code', 'code_language_id'];
    public $timestamps = false;
    protected $table = 'posts_code';
    protected $with = ['language'];

    public function post() {
        return $this->morphOne(Post::class, 'postable');
    }
    
    public function language() {
        return $this->belongsTo(CodeLanguage::class, 'code_language_id');
    }
}
