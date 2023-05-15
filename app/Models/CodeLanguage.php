<?php

namespace App\Models;

use App\Models\PostTypes\Code;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeLanguage extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = ['name', 'slug'];

    public function codePosts() {
        return $this->hasMany(Code::class);
    }
}
